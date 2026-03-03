import { supabase } from './supabaseClient.js'

/* ================= GLOBAL ================= */
let currentUser = null


/* ================= LOAD DASHBOARD ================= */
async function loadDashboard() {

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    window.location.href = "index.html"
    return
  }

  currentUser = user

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (error) {
    showToast("Error loading profile", "error")
    return
  }

  const userInfo = document.getElementById("userInfo")

  if (profile.role === "student") {

    userInfo.innerHTML = `
      👤 ${profile.name} |
      🎓 Roll: ${profile.roll_number || '-'} |
      📧 ${currentUser.email}
    `

    document.getElementById("studentSection").style.display = "block"
    loadStudentParcels(user.id)

  } else {

    userInfo.innerHTML = `
      🛡 Gatekeeper: ${profile.name} |
      📧 ${currentUser.email}
    `

    document.getElementById("gatekeeperSection").style.display = "block"
    loadAllParcels()
  }
}


/* ================= STUDENT VIEW ================= */
async function loadStudentParcels(userId) {

  const { data, error } = await supabase
    .from('parcels')
    .select('*')
    .eq('student_id', userId)
    .order('received_at', { ascending: false })

  if (error) {
    showToast("Error loading parcels", "error")
    return
  }

  const table = document.getElementById("parcelTable")
  table.innerHTML = ""

  data.forEach(parcel => {
    const row = document.createElement("tr")
    row.innerHTML = `
      <td>${parcel.courier_name}</td>
      <td>${parcel.status}</td>
      <td>${new Date(parcel.received_at).toLocaleString()}</td>
    `
    table.appendChild(row)
  })
}


/* ================= GATEKEEPER VIEW ================= */
async function loadAllParcels() {

  const { data, error } = await supabase
    .from('parcels')
    .select(`
      id,
      courier_name,
      status,
      received_at,
      profiles:parcels_student_id_fkey (
        name,
        roll_number,
        mobile,
        email
      )
    `)
    .eq('status', 'pending')
    .order('received_at', { ascending: false })
    .limit(5)

  if (error) {
    showToast("Error loading parcels", "error")
    return
  }

  renderGatekeeperTable(data)
}


/* ================= RENDER TABLE ================= */
function renderGatekeeperTable(data) {

  const table = document.getElementById("allParcelTable")
  table.innerHTML = ""

  data.forEach(parcel => {

    const actionButton = parcel.status === "pending"
      ? `<button onclick="markCollected('${parcel.id}')">Mark as Collected</button>`
      : ""

    const row = document.createElement("tr")
    row.innerHTML = `
      <td>${parcel.profiles?.roll_number || '-'}</td>
      <td>${parcel.profiles?.name || '-'}</td>
      <td>${parcel.profiles?.mobile || '-'}</td>
      <td>${parcel.profiles?.email || '-'}</td>
      <td>${parcel.courier_name}</td>
      <td>${parcel.status}</td>
      <td>${actionButton}</td>
    `

    table.appendChild(row)
  })
}


/* ================= ADD PARCEL ================= */
async function addParcel() {

  const roll = document.getElementById("rollSearch").value.trim()
  const courier = document.getElementById("courier").value.trim()

  if (!roll || !courier) {
    showToast("Please enter roll number and courier name", "error")
    return
  }

  // 🔎 Find student
  const { data: student, error: studentError } = await supabase
    .from('profiles')
    .select('*')
    .eq('roll_number', roll)
    .single()

  if (studentError || !student) {
    showToast("Student not found", "error")
    return
  }

  // 📦 Insert parcel
  const { error: insertError } = await supabase
    .from('parcels')
    .insert({
      student_id: student.id,
      courier_name: courier,
      status: "pending"
    })

  if (insertError) {
    showToast(insertError.message, "error")
    return
  }

  // 📧 Send email using Edge Function (NO CORS ISSUE)
  const { error: emailError } = await supabase.functions.invoke("send-email", {
    body: {
      email: student.email,
      name: student.name || "Student",
      courier: courier
    }
  })

  if (emailError) {
    showToast("Parcel added but email failed ❌", "error")
  } else {
    showToast("Parcel added & Email sent ✅", "success")
  }
}


/* ================= SEARCH ================= */
async function searchParcels() {

  const keyword = document.getElementById("parcelSearch").value.trim()

  if (!keyword) {
    loadAllParcels()
    return
  }

  const safeKeyword = keyword.replace(/[,()]/g, "")

  try {

    const { data: matchedProfiles, error: profileError } = await supabase
      .from('profiles')
      .select('id')
      .or(`name.ilike.%${safeKeyword}%,roll_number.ilike.%${safeKeyword}%,mobile.ilike.%${safeKeyword}%,email.ilike.%${safeKeyword}%`)

    if (profileError) throw profileError

    const profileIds = matchedProfiles.map(p => p.id)

    let query = supabase
      .from('parcels')
      .select(`
        id,
        courier_name,
        status,
        received_at,
        profiles:parcels_student_id_fkey (
          name,
          roll_number,
          mobile,
          email
        )
      `)
      .order('received_at', { ascending: false })

    if (profileIds.length > 0) {
      query = query.in('student_id', profileIds)
    } else {
      query = query.ilike('courier_name', `%${safeKeyword}%`)
    }

    const { data, error } = await query

    if (error) throw error

    renderGatekeeperTable(data)

  } catch (err) {
    showToast("Search failed", "error")
  }
}


/* ================= MARK COLLECTED ================= */
async function markCollected(parcelId) {

  const { error } = await supabase
    .from('parcels')
    .update({
      status: "collected",
      collected_at: new Date().toISOString()
    })
    .eq('id', parcelId)

  if (error) {
    showToast("Update failed", "error")
    return
  }

  showToast("Parcel marked as collected", "success")
  loadAllParcels()
}


/* ================= DARK MODE ================= */
function toggleTheme() {
  document.body.classList.toggle("dark-mode")
  localStorage.setItem(
    "theme",
    document.body.classList.contains("dark-mode") ? "dark" : "light"
  )
}

if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark-mode")
}


/* ================= LOGOUT ================= */
async function logout() {
  await supabase.auth.signOut()
  window.location.href = "index.html"
}


/* ================= TOAST ================= */
function showToast(message, type = "success") {
  const toast = document.getElementById("toast")
  toast.textContent = message
  toast.className = `toast show ${type}`
  setTimeout(() => toast.classList.remove("show"), 3000)
}


/* ================= EXPORT ================= */
window.addParcel = addParcel
window.logout = logout
window.markCollected = markCollected
window.searchParcels = searchParcels
window.toggleTheme = toggleTheme

loadDashboard()