import { supabase } from './supabaseClient.js'

/* =========================================================
   REGISTER FUNCTION
========================================================= */
async function register() {

  const name = document.getElementById("name")?.value.trim()
  const roll = document.getElementById("roll")?.value.trim()
  const role = document.getElementById("role")?.value
  const email = document.getElementById("email")?.value.trim()
  const password = document.getElementById("password")?.value.trim()
  const mobile = document.getElementById("mobile")?.value.trim()
if (!role) {
  showToast("Please select a role", "error")
  return
}
  // Basic Validation
  if (!name || !email || !password) {
    showToast("Please fill all required fields", "error")
    return
  }

  if (role === "student" && !roll) {
    showToast("Roll number required for students", "error")
    return
  }

  toggleLoading(true)

  // Sign Up
  const { data, error } = await supabase.auth.signUp({
    email,
    password
  })

  if (error) {
    toggleLoading(false)
    showToast(error.message, "error")
    return
  }

  const user = data.user

  // Insert profile
  const { error: profileError } = await supabase
    .from('profiles')
    .insert({
      id: user.id,
      name,
      email,  // ✅ Store email in profiles
      roll_number: role === "student" ? roll : null,
      mobile: role === "student" ? mobile : null,
      role
    })

  toggleLoading(false)

  if (profileError) {
    showToast(profileError.message, "error")
    return
  }

  showToast("Registration successful!", "success")

  setTimeout(() => {
    window.location.href = "index.html"
  }, 1500)
}



/* =========================================================
   LOGIN FUNCTION
========================================================= */
async function login() {

  const email = document.getElementById("email")?.value.trim()
  const password = document.getElementById("password")?.value.trim()

  if (!email || !password) {
    showToast("Please enter email and password", "error")
    return
  }

  toggleLoading(true)

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password
  })

  toggleLoading(false)

  if (error) {
    showToast(error.message, "error")
    return
  }

  showToast("Login successful!", "success")

  setTimeout(() => {
    window.location.href = "dashboard.html"
  }, 1000)
}



/* =========================================================
   TOAST FUNCTION
========================================================= */
function showToast(message, type = "success") {

  const toast = document.getElementById("toast")

  toast.textContent = message
  toast.className = `toast show ${type}`

  setTimeout(() => {
    toast.classList.remove("show")
  }, 3000)
}



/* =========================================================
   LOADING BUTTON EFFECT
========================================================= */
function toggleLoading(isLoading) {

  const buttons = document.querySelectorAll("button")

  buttons.forEach(btn => {
    btn.disabled = isLoading
    btn.style.opacity = isLoading ? "0.6" : "1"
  })
}



/* =========================================================
   DARK MODE SYSTEM
========================================================= */
function toggleTheme() {

  document.body.classList.toggle("dark-mode")

  if (document.body.classList.contains("dark-mode")) {
    localStorage.setItem("theme", "dark")
  } else {
    localStorage.setItem("theme", "light")
  }
}

// Load saved theme
if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark-mode")
}

window.toggleTheme = toggleTheme



/* =========================================================
   EXPORT GLOBAL FUNCTIONS
========================================================= */
window.register = register
window.login = login
window.showToast = showToast


