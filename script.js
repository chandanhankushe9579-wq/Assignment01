// DOM Elements
const form = document.getElementById('registrationForm');
const successMessage = document.getElementById('successMessage');
const userDetails = document.getElementById('userDetails');
const backBtn = document.getElementById('backBtn');
const togglePassword = document.getElementById('togglePassword');
const passwordInput = document.getElementById('password');
const strengthBar = document.getElementById('strengthBar');
const strengthText = document.getElementById('strengthText');
const submitBtn = document.getElementById('submitBtn');

// Password strength levels
const strengthLevels = {
    0: { text: 'Very Weak', color: '#ef4444', width: '20%' },
    1: { text: 'Weak', color: '#f97316', width: '40%' },
    2: { text: 'Fair', color: '#eab308', width: '60%' },
    3: { text: 'Good', color: '#22c55e', width: '80%' },
    4: { text: 'Strong', color: '#10b981', width: '100%' }
};

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    // Load saved draft if exists
    loadFormDraft();
    
    // Setup real-time validation
    setupRealTimeValidation();
    
    // Setup form submission
    setupFormSubmission();
    
    // Setup success page back button
    backBtn.addEventListener('click', resetForm);
});

// Load form draft from localStorage
function loadFormDraft() {
    const draft = localStorage.getItem('registrationDraft');
    if (draft) {
        const data = JSON.parse(draft);
        Object.keys(data).forEach(key => {
            const element = document.getElementById(key);
            if (element) {
                if (element.type === 'checkbox') {
                    element.checked = data[key];
                } else {
                    element.value = data[key];
                }
            }
        });
        validateForm(); // Validate loaded data
    }
}

// Auto-save form data
function autoSaveForm() {
    const formData = {
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        username: document.getElementById('username').value,
        email: document.getElementById('email').value,
        password: document.getElementById('password').value,
        confirmPassword: document.getElementById('confirmPassword').value,
        countryCode: document.getElementById('countryCode').value,
        phone: document.getElementById('phone').value,
        country: document.getElementById('country').value,
        city: document.getElementById('city').value,
        pan: document.getElementById('pan').value,
        aadhaar: document.getElementById('aadhaar').value,
        messageDeepSeek: document.getElementById('messageDeepSeek').checked,
        deepTankSearch: document.getElementById('deepTankSearch').checked,
        terms: document.getElementById('terms').checked
    };
    
    localStorage.setItem('registrationDraft', JSON.stringify(formData));
}

// Setup real-time validation
function setupRealTimeValidation() {
    // Password toggle
    togglePassword.addEventListener('click', function() {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        this.innerHTML = type === 'password' ? '<i class="fas fa-eye"></i>' : '<i class="fas fa-eye-slash"></i>';
    });
    
    // Real-time password strength check
    passwordInput.addEventListener('input', function() {
        checkPasswordStrength(this.value);
        validateField('password', this.value);
        validateField('confirmPassword', document.getElementById('confirmPassword').value);
        autoSaveForm();
    });
    
    // Real-time validation for all fields
    const fields = ['firstName', 'lastName', 'username', 'email', 'confirmPassword', 
                   'phone', 'country', 'city', 'pan', 'aadhaar'];
    
    fields.forEach(field => {
        const element = document.getElementById(field);
        if (element) {
            element.addEventListener('input', function() {
                validateField(field, this.value);
                autoSaveForm();
            });
        }
    });
    
    // Select fields
    document.getElementById('countryCode').addEventListener('change', autoSaveForm);
    document.getElementById('country').addEventListener('change', autoSaveForm);
    
    // Checkboxes
    document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
        checkbox.addEventListener('change', autoSaveForm);
    });
}

// Validate a single field
function validateField(fieldId, value) {
    const errorElement = document.getElementById(fieldId + 'Error');
    const inputElement = document.getElementById(fieldId);
    
    if (!errorElement) return true;
    
    let error = '';
    let isValid = true;
    
    switch(fieldId) {
        case 'firstName':
        case 'lastName':
            if (!value.trim()) {
                error = 'This field is required';
                isValid = false;
            } else if (value.length < 2) {
                error = 'Minimum 2 characters required';
                isValid = false;
            }
            break;
            
        case 'username':
            if (!value.trim()) {
                error = 'Username is required';
                isValid = false;
            } else if (value.length < 3) {
                error = 'Minimum 3 characters required';
                isValid = false;
            }
            break;
            
        case 'email':
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!value.trim()) {
                error = 'Email is required';
                isValid = false;
            } else if (!emailRegex.test(value)) {
                error = 'Invalid email format';
                isValid = false;
            }
            break;
            
        case 'password':
            if (!value) {
                error = 'Password is required';
                isValid = false;
            } else if (value.length < 8) {
                error = 'Minimum 8 characters required';
                isValid = false;
            }
            break;
            
        case 'confirmPassword':
            const password = document.getElementById('password').value;
            if (!value) {
                error = 'Please confirm your password';
                isValid = false;
            } else if (value !== password) {
                error = 'Passwords do not match';
                isValid = false;
            }
            break;
            
        case 'phone':
            const phoneRegex = /^\d{10}$/;
            if (!value.trim()) {
                error = 'Phone number is required';
                isValid = false;
            } else if (!phoneRegex.test(value)) {
                error = 'Please enter 10-digit phone number';
                isValid = false;
            }
            break;
            
        case 'country':
            if (!value) {
                error = 'Please select a country';
                isValid = false;
            }
            break;
            
        case 'city':
            if (!value.trim()) {
                error = 'City is required';
                isValid = false;
            }
            break;
            
        case 'pan':
            const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
            if (!value.trim()) {
                error = 'PAN is required';
                isValid = false;
            } else if (!panRegex.test(value.toUpperCase())) {
                error = 'Invalid PAN format (e.g., ABCDE1234F)';
                isValid = false;
            }
            break;
            
        case 'aadhaar':
            const aadhaarRegex = /^\d{12}$/;
            if (!value.trim()) {
                error = 'Aadhaar is required';
                isValid = false;
            } else if (!aadhaarRegex.test(value)) {
                error = 'Aadhaar must be 12 digits';
                isValid = false;
            }
            break;
    }
    
    // Update UI
    errorElement.textContent = error;
    if (inputElement) {
        if (error) {
            inputElement.classList.add('error');
        } else {
            inputElement.classList.remove('error');
        }
    }
    
    return isValid;
}

// Check password strength
function checkPasswordStrength(password) {
    let strength = 0;
    
    // Length check
    if (password.length >= 8) strength++;
    
    // Contains lowercase
    if (/[a-z]/.test(password)) strength++;
    
    // Contains uppercase
    if (/[A-Z]/.test(password)) strength++;
    
    // Contains numbers
    if (/\d/.test(password)) strength++;
    
    // Contains special characters
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    
    // Cap at 4
    strength = Math.min(strength, 4);
    
    // Update UI
    const level = strengthLevels[strength];
    strengthBar.style.width = level.width;
    strengthBar.style.backgroundColor = level.color;
    strengthText.textContent = `Password strength: ${level.text}`;
}

// Validate entire form
function validateForm() {
    let isValid = true;
    
    // Validate all fields
    const fields = ['firstName', 'lastName', 'username', 'email', 'password', 
                   'confirmPassword', 'phone', 'country', 'city', 'pan', 'aadhaar'];
    
    fields.forEach(field => {
        const element = document.getElementById(field);
        if (element) {
            if (!validateField(field, element.value)) {
                isValid = false;
            }
        }
    });
    
    // Validate terms
    const termsChecked = document.getElementById('terms').checked;
    const termsError = document.getElementById('termsError');
    if (!termsChecked) {
        termsError.textContent = 'You must agree to the terms';
        isValid = false;
    } else {
        termsError.textContent = '';
    }
    
    // Update submit button
    submitBtn.disabled = !isValid;
    
    return isValid;
}

// Setup form submission
function setupFormSubmission() {
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (validateForm()) {
            // Prepare user data
            const userData = {
                name: `${document.getElementById('firstName').value} ${document.getElementById('lastName').value}`,
                username: document.getElementById('username').value,
                email: document.getElementById('email').value,
                phone: `${document.getElementById('countryCode').value} ${document.getElementById('phone').value}`,
                location: `${document.getElementById('city').value}, ${document.getElementById('country').value}`,
                pan: document.getElementById('pan').value.toUpperCase(),
                aadhaar: document.getElementById('aadhaar').value,
                features: {
                    messageDeepSeek: document.getElementById('messageDeepSeek').checked,
                    deepTankSearch: document.getElementById('deepTankSearch').checked
                },
                registeredAt: new Date().toLocaleString()
            };
            
            // Save to localStorage
            localStorage.setItem('userRegistration', JSON.stringify(userData));
            
            // Clear draft
            localStorage.removeItem('registrationDraft');
            
            // Show success page
            showSuccessPage(userData);
        }
    });
}

// Show success page with user details
function showSuccessPage(userData) {
    // Hide form, show success message
    form.style.display = 'none';
    successMessage.style.display = 'block';
    
    // Populate user details
    userDetails.innerHTML = `
        <div class="detail-item">
            <strong>Full Name</strong>
            <span>${userData.name}</span>
        </div>
        <div class="detail-item">
            <strong>Username</strong>
            <span>${userData.username}</span>
        </div>
        <div class="detail-item">
            <strong>Email</strong>
            <span>${userData.email}</span>
        </div>
        <div class="detail-item">
            <strong>Phone Number</strong>
            <span>${userData.phone}</span>
        </div>
        <div class="detail-item">
            <strong>Location</strong>
            <span>${userData.location}</span>
        </div>
        <div class="detail-item">
            <strong>PAN Number</strong>
            <span>${userData.pan}</span>
        </div>
        <div class="detail-item">
            <strong>Aadhaar Number</strong>
            <span>${userData.aadhaar}</span>
        </div>
        <div class="detail-item">
            <strong>Registration Time</strong>
            <span>${userData.registeredAt}</span>
        </div>
        <div class="detail-item" style="grid-column: 1 / -1">
            <strong>Enabled Features</strong>
            <div style="margin-top: 10px">
                ${userData.features.messageDeepSeek ? 
                    '<div style="color: #10b981; margin-bottom: 5px"><i class="fas fa-check"></i> Message DeepSeek</div>' : ''}
                ${userData.features.deepTankSearch ? 
                    '<div style="color: #10b981"><i class="fas fa-check"></i> DeepTank Search</div>' : ''}
            </div>
        </div>
    `;
    
    // Log to console
    console.log('Registration Successful!', userData);
    console.log('Form submitted successfully!');
}

// Reset form for new registration
function resetForm() {
    // Reset form display
    form.reset();
    form.style.display = 'block';
    successMessage.style.display = 'none';
    
    // Clear errors
    document.querySelectorAll('.error-message').forEach(el => {
        el.textContent = '';
    });
    
    document.querySelectorAll('.error').forEach(el => {
        el.classList.remove('error');
    });
    
    // Reset password strength
    strengthBar.style.width = '0%';
    strengthText.textContent = 'Password strength: ';
    
    // Focus on first field
    document.getElementById('firstName').focus();
    
    // Clear localStorage draft
    localStorage.removeItem('registrationDraft');
}
