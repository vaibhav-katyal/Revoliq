import {
  auth,
  db,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  getDoc,
  setDoc,
  doc,
} from "./firebase-auth.js"

document.addEventListener("DOMContentLoaded", () => {
  // DOM Elements
  const signUpButton = document.getElementById("signUp")
  const signInButton = document.getElementById("signIn")
  const container = document.querySelector(".container")
  const signUpForm = document.getElementById("signUpForm")
  const signInForm = document.getElementById("signInForm")
  const togglePasswordButtons = document.querySelectorAll(".toggle-password")
  const userTypeOptions = document.querySelectorAll(".user-type-option")
  const signUpUserTypeInput = document.getElementById("signUpUserType")
  const signInUserTypeInput = document.getElementById("signInUserType")
  const retailerFields = document.getElementById("retailerFields")
  const forgotPasswordLink = document.querySelector(".forgot-password")

  // Panel toggle
  signUpButton.addEventListener("click", () => {
    container.classList.add("right-panel-active")
  })

  signInButton.addEventListener("click", () => {
    container.classList.remove("right-panel-active")
  })

  // Password visibility toggle
  togglePasswordButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const passwordField = this.previousElementSibling
      const type = passwordField.getAttribute("type") === "password" ? "text" : "password"
      passwordField.setAttribute("type", type)
      this.classList.toggle("fa-eye")
      this.classList.toggle("fa-eye-slash")
    })
  })

  // User type selection
  userTypeOptions.forEach((option) => {
    option.addEventListener("click", function () {
      const form = this.closest("form")
      const userTypeInput = form.id === "signUpForm" ? signUpUserTypeInput : signInUserTypeInput

      // Remove active class from all options in this form
      form.querySelectorAll(".user-type-option").forEach((opt) => {
        opt.classList.remove("active")
      })

      // Add active class to clicked option
      this.classList.add("active")

      // Set the user type value
      const userType = this.getAttribute("data-type")
      userTypeInput.value = userType

      // Show/hide retailer-specific fields in signup form
      if (form.id === "signUpForm") {
        retailerFields.style.display = userType === "retailer" ? "block" : "none"
      }
    })
  })

  // Form validation
  function validateEmail(email) {
    const re =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return re.test(String(email).toLowerCase())
  }

  function validatePassword(password) {
    return password.length >= 8
  }

  function showError(inputId, message) {
    const errorElement = document.getElementById(inputId + "Error")
    if (errorElement) {
      errorElement.textContent = message
      errorElement.style.display = "block"
      document.getElementById(inputId).classList.add("error")
    }
  }

  function clearError(inputId) {
    const errorElement = document.getElementById(inputId + "Error")
    if (errorElement) {
      errorElement.textContent = ""
      errorElement.style.display = "none"
      document.getElementById(inputId).classList.remove("error")
    }
  }


  
  // 🚀 Sign-Up Function
  signUpForm.addEventListener("submit", async (event) => {
    event.preventDefault()

    // Disable the submit button to prevent multiple submissions
    const submitButton = signUpForm.querySelector('button[type="submit"]')
    if (submitButton) submitButton.disabled = true

    let isValid = true

    const name = document.getElementById("signUpName").value.trim()
    const email = document.getElementById("signUpEmail").value.trim()
    const password = document.getElementById("signUpPassword").value
    const userType = signUpUserTypeInput.value || "customer" // Default to customer if not selected
    const termsChecked = document.getElementById("termsCheckbox").checked
    const storeName = userType === "retailer" ? document.getElementById("storeName").value.trim() : ""

    // Clear previous errors
    clearError("signUpName")
    clearError("signUpEmail")
    clearError("signUpPassword")
    clearError("storeName")
    try {
      console.log("Attempting to create user with email:", email);
  
      // Step 1: Create user in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log("✅ User created in Firebase:", userCredential.user.uid);
  
      // Step 2: Send user data to MongoDB
      const userData = {
          uid: userCredential.user.uid,
          email: userCredential.user.email,
          name: name,
          userType: userType,
          storeName: userType === "retailer" ? storeName : null
      };
  
      console.log("📡 Sending user data to MongoDB...");
      const response = await fetch("https://revoliq.onrender.com/api/storeUser", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(userData)
      });
  
      const result = await response.json();
      if (!result.success) {
          console.error("❌ Error saving user in MongoDB:", result.message);
          alert("Failed to save user in MongoDB: " + result.message);
          return;
      }
  
      console.log("✅ User successfully stored in MongoDB!");
      alert("Sign-up successful! Please sign in.");
      
      // Redirect only after MongoDB confirmation
      container.classList.remove("right-panel-active");
  } catch (error) {
      console.error("❌ Signup error:", error.message);
      alert(`Signup failed: ${error.message}`);
  }
  
  
    // Validate name
    if (name === "") {
      showError("signUpName", "Please enter your name")
      isValid = false
    }

    // Validate email
    if (email === "") {
      showError("signUpEmail", "Please enter your email")
      isValid = false
    } else if (!validateEmail(email)) {
      showError("signUpEmail", "Please enter a valid email address")
      isValid = false
    }

    // Validate password
    if (password === "") {
      showError("signUpPassword", "Please enter a password")
      isValid = false
    } else if (!validatePassword(password)) {
      showError("signUpPassword", "Password must be at least 8 characters")
      isValid = false
    }

    // Validate retailer-specific fields
    if (userType === "retailer" && storeName === "") {
      showError("storeName", "Please enter your store name")
      isValid = false
    }

    // Validate terms
    if (!termsChecked) {
      alert("Please agree to the Terms of Service and Privacy Policy")
      isValid = false
    }

    if (isValid) {
      try {
        console.log("Attempting to create user with email:", email)

        // Create the user in Firebase Authentication
        const userCredential = await createUserWithEmailAndPassword(auth, email, password)
        console.log("User created successfully in Firebase Auth:", userCredential.user.uid)

        // Store additional user data in Firestore
        const userData = {
          uid: userCredential.user.uid,
          email: userCredential.user.email,
          name: name,
          userType: userType,
          storeName: userType === "retailer" ? storeName : null,
          createdAt: new Date().toISOString(),
        }

        console.log("Storing user data in Firestore:", userData)
        await setDoc(doc(db, "users", userCredential.user.uid), userData)
        console.log("User data stored successfully in Firestore")

        alert("Sign Up successful! Please sign in.")

        // Clear the form
        signUpForm.reset()

        // Switch to sign in panel
        container.classList.remove("right-panel-active")
      } catch (error) {
        console.error("Error during sign up:", error.code, error.message)
        alert(`Sign up failed: ${error.message}`)
      } finally {
        // Re-enable the submit button
        if (submitButton) submitButton.disabled = false
      }
    } else {
      // Re-enable the submit button if validation fails
      if (submitButton) submitButton.disabled = false
    }
  })

  // 🚀 Login Function
  signInForm.addEventListener("submit", async (event) => {
    event.preventDefault()

    // Disable the submit button to prevent multiple submissions
    const submitButton = signInForm.querySelector('button[type="submit"]')
    if (submitButton) submitButton.disabled = true

    let isValid = true

    const email = document.getElementById("signInEmail").value.trim()
    const password = document.getElementById("signInPassword").value
    const userType = signInUserTypeInput.value || "customer" // Default to customer if not selected

    // Clear previous errors
    clearError("signInEmail")
    clearError("signInPassword")
    try {
      console.log("Signing in user with email:", email);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log("User signed in successfully:", userCredential.user.uid);

      // Fetch user data from MongoDB
      const response = await fetch(`https://revoliq.onrender.com/api/getUser/${userCredential.user.uid}`);
      const userData = await response.json();

      if (!userData.success) {
          alert("User not found in MongoDB! Please sign up again.");
          return;
      }

      console.log("MongoDB User Data:", userData.user);

      // Store user data in localStorage
      localStorage.setItem("user", JSON.stringify(userData.user));

      alert("Login Successful!");

      // Redirect based on user type
      window.location.href = userData.user.userType === "retailer" 
          ? "/ret_dash.html" 
          : "/customer-profile.html";
          
  } catch (error) {
      console.error("Sign-in error:", error.message);
      alert(`Sign-in failed: ${error.message}`);
  }
  
    // Validate email
    if (email === "") {
      showError("signInEmail", "Please enter your email")
      isValid = false
    } else if (!validateEmail(email)) {
      showError("signInEmail", "Please enter a valid email address")
      isValid = false
    }

    // Validate password
    if (password === "") {
      showError("signInPassword", "Please enter your password")
      isValid = false
    }

    if (isValid) {
      try {
        console.log("Attempting to sign in with email:", email)
        const userCredential = await signInWithEmailAndPassword(auth, email, password)
        const uid = userCredential.user.uid
        console.log("User signed in successfully:", uid)

        // Get user type from Firestore
        const userDoc = await getDoc(doc(db, "users", uid))

        if (!userDoc.exists()) {
          console.log("User document not found in Firestore")
          alert("User not found in database. Please sign up first.")
          await auth.signOut()
          return
        }

        const userData = userDoc.data()
        const storedUserType = userData.userType
        console.log("Retrieved user data:", userData)

        if (storedUserType !== userType) {
          console.log(`User type mismatch: selected ${userType}, stored ${storedUserType}`)
          alert(
            `You selected ${userType} but your account is registered as ${storedUserType}. Please select the correct user type.`,
          )
          await auth.signOut()
          return
        }

        alert("Login Successful!")
        // Redirect based on user type
        window.location.href = userType === "retailer" ? "/Revoliq/ret_dash.html" : "customer_dashboard.html"
      } catch (error) {
        console.error("Error during sign in:", error.code, error.message)
        alert(`Login failed: ${error.message}`)
      } finally {
        // Re-enable the submit button
        if (submitButton) submitButton.disabled = false
      }
    } else {
      // Re-enable the submit button if validation fails
      if (submitButton) submitButton.disabled = false
    }
  })

  // 🚀 Forgot Password Function
  forgotPasswordLink.addEventListener("click", async (event) => {
    event.preventDefault()
    const email = prompt("Enter your email to reset your password:")

    if (email) {
      try {
        await sendPasswordResetEmail(auth, email)
        alert("Password reset link sent to your email.")
      } catch (error) {
        if (error.code === "auth/user-not-found") {
          alert("No account found with this email.")
        } else {
          alert(error.message)
        }
      }
    }
  })

  // Add input event listeners to clear errors when typing
  document.querySelectorAll("input").forEach((input) => {
    input.addEventListener("input", function () {
      if (this.id) {
        clearError(this.id)
      }
    })
  })

  // Set default user type if none selected
  if (!signUpUserTypeInput.value) {
    const defaultOption = signUpForm.querySelector('.user-type-option[data-type="customer"]')
    if (defaultOption) {
      defaultOption.click()
    } else {
      signUpUserTypeInput.value = "customer"
    }
  }

  if (!signInUserTypeInput.value) {
    const defaultOption = signInForm.querySelector('.user-type-option[data-type="customer"]')
    if (defaultOption) {
      defaultOption.click()
    } else {
      signInUserTypeInput.value = "customer"
    }
  }
})

