document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('registrationForm');
    const togglePassword = document.getElementById('togglePassword');
    const passwordInput = document.getElementById('password');
    const successMessage = document.getElementById('successMessage');
    const resetBtn = document.getElementById('resetBtn');

    // Toggle password visibility
    togglePassword.addEventListener('click', function() {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        this.innerHTML = type === 'password' ? '<i class="fas fa-eye"></i>' : '<i class="fas fa-eye-slash"></i>';
    });

    // Form validation
    function validateForm() {
        let isValid = true;
        
        // Clear previous errors
        document.querySelectorAll('.error').forEach(el => el.textContent = '');
        
        // Validate Ether Name
        const etherName = document.getElementById('etherName').value.trim();
        if (!etherName) {
            document.getElementById('nameError').textContent = 'Ether Name is required';
            isValid = false;
        } else if (etherName.length < 3) {
            document.getElementById('nameError').textContent = 'Must be at least 3 characters';
            isValid = false;
        }
        
        // Validate Email
        const email = document.getElementById('email').value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email) {
            document.getElementById('emailError').textContent = 'Email is required';
            isValid = false;
        } else if (!emailRegex.test(email)) {
            document.getElementById('emailError').textContent = 'Invalid email format';
            isValid = false;
        }
        
        // Validate Password
        const password = document.getElementById('password').value;
        if (!password) {
            document.getElementById('passwordError').textContent = 'Password is required';
            isValid = false;
        } else if (password.length < 6) {
            document.getElementById('passwordError').textContent = 'Password must be at least 6 characters';
            isValid = false;
        }
        
        // Validate Confirm Password
        const confirmPassword = document.getElementById('confirmPassword').value;
        if (!confirmPassword) {
            document.getElementById('confirmError').textContent = 'Please confirm password';
            isValid = false;
        } else if (password !== confirmPassword) {
            document.getElementById('confirmError').textContent = 'Passwords do not match';
            isValid = false;
        }
        
        return isValid;
    }

    // Form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (validateForm()) {
            // Get form data
            const formData = {
                etherName: document.getElementById('etherName').value,
                email: document.getElementById('email').value,
                messageDeepSeek: document.getElementById('messageDeepSeek').checked,
                deepTankSearch: document.getElementById('deepTankSearch').checked,
                timestamp: new Date().toISOString()
            };
            
            // Save to localStorage
            localStorage.setItem('userRegistration', JSON.stringify(formData));
            
            // Show success message
            form.style.display = 'none';
            successMessage.style.display = 'block';
            
            // Log data
            console.log('Registration Successful:', formData);
            console.log('Home Page Features:');
            console.log('- Message DeepSeek:', formData.messageDeepSeek ? 'Enabled' : 'Disabled');
            console.log('- DeepTank Search:', formData.deepTankSearch ? 'Enabled' : 'Disabled');
            console.log('Content Editor ready with style.css integration');
        }
    });

    // Reset form
    resetBtn.addEventListener('click', function() {
        form.reset();
        form.style.display = 'block';
        successMessage.style.display = 'none';
        document.querySelectorAll('.error').forEach(el => el.textContent = '');
    });

    // Auto-save draft every 3 seconds
    let saveTimer;
    form.addEventListener('input', function() {
        clearTimeout(saveTimer);
        saveTimer = setTimeout(() => {
            const draftData = {
                etherName: document.getElementById('etherName').value,
                email: document.getElementById('email').value
            };
            localStorage.setItem('formDraft', JSON.stringify(draftData));
        }, 3000);
    });

    // Load draft on page load
    const draft = localStorage.getItem('formDraft');
    if (draft) {
        const draftData = JSON.parse(draft);
        document.getElementById('etherName').value = draftData.etherName || '';
        document.getElementById('email').value = draftData.email || '';
    }
});