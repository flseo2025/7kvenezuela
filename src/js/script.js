// Form validation and handling
class LeadCaptureForm {
    constructor() {
        this.form = document.getElementById('leadCaptureForm');
        this.submitButton = this.form.querySelector('.submit-button');
        this.sameAddressCheckbox = document.getElementById('sameAsMailingAddress');
        this.mailingAddress = document.getElementById('mailingAddress');
        this.shippingAddress = document.getElementById('shippingAddress');
        
        this.init();
    }

    init() {
        this.bindEvents();
        this.setupAddressSync();
        this.setupPaymentMethodToggle();
    }

    bindEvents() {
        this.form.addEventListener('submit', this.handleSubmit.bind(this));
        this.form.addEventListener('input', this.handleRealTimeValidation.bind(this));
        this.form.addEventListener('change', this.handleRealTimeValidation.bind(this));
        this.form.addEventListener('blur', this.handleFieldBlur.bind(this), true);
    }

    setupAddressSync() {
        // Address synchronization disabled - shipping address fields are hidden
        // Keeping method for compatibility but no functionality needed
    }

    getTranslation(key) {
        return window.translationManager ? window.translationManager.getTranslation(key) : key;
    }

    setupPaymentMethodToggle() {
        const paymentMethodCheckboxes = document.querySelectorAll('input[name="paymentMethod"]');
        const otherPaymentContainer = document.getElementById('otherPaymentContainer');
        const otherCheckbox = document.getElementById('paymentMethodOther');
        
        // Add change event listener to all payment method checkboxes
        paymentMethodCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                // Check if "other" checkbox is checked
                if (otherCheckbox.checked) {
                    otherPaymentContainer.style.display = 'block';
                } else {
                    otherPaymentContainer.style.display = 'none';
                    // Clear the other payment method field when not needed
                    document.getElementById('otherPaymentMethod').value = '';
                }
            });
        });
    }

    validateField(field, showError = true) {
        const value = field.value.trim();
        const fieldType = field.type;
        const fieldName = field.name;
        let isValid = true;
        let errorMessage = '';

        // Remove existing error message
        this.removeErrorMessage(field);

        // Required field validation
        if (field.hasAttribute('required') && !value) {
            isValid = false;
            errorMessage = this.getTranslation('validation.required');
        }

        // Email validation with enhanced pattern
        if (fieldType === 'email' && value) {
            const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
            if (!emailRegex.test(value)) {
                isValid = false;
                errorMessage = this.getTranslation('validation.email');
            }
        }

        // International phone validation (South America friendly)
        if (fieldType === 'tel' && value) {
            // Remove all non-digit characters except + at the beginning
            const phoneClean = value.replace(/[^\d+]/g, '').replace(/(?!^)\+/g, '');
            
            // Allow various South American formats:
            // Venezuela: +58 XXX XXX XXXX (12-13 digits with country code)
            // Colombia: +57 XXX XXX XXXX (12-13 digits with country code)
            // Brazil: +55 XX XXXX XXXX (13-14 digits with country code)
            // Argentina: +54 XX XXXX XXXX (12-14 digits with country code)
            // Local numbers: 7-11 digits
            // International: 8-15 digits total
            
            let isValidPhone = false;
            
            if (phoneClean.startsWith('+')) {
                // International format: +XX to +XXX followed by 7-12 more digits
                const intlRegex = /^\+[1-9]\d{7,14}$/;
                isValidPhone = intlRegex.test(phoneClean);
            } else {
                // Local format: 7-11 digits (covers most South American local numbers)
                const localRegex = /^[0-9]{7,11}$/;
                isValidPhone = localRegex.test(phoneClean);
            }
            
            if (!isValidPhone) {
                isValid = false;
                errorMessage = this.getTranslation('validation.phone');
            }
        }

        // Name validation (letters, spaces, hyphens, apostrophes only)
        if ((fieldName.includes('Name') || fieldName.includes('firstName') || fieldName.includes('lastName')) && value) {
            const nameRegex = /^[a-zA-Z\s\-'\.]+$/;
            if (!nameRegex.test(value)) {
                isValid = false;
                errorMessage = this.getTranslation('validation.name');
            }
        }

        // Radio button validation
        if (field.type === 'radio' && field.hasAttribute('required')) {
            const radioGroup = this.form.querySelectorAll(`input[name="${fieldName}"]`);
            const isChecked = Array.from(radioGroup).some(radio => radio.checked);
            if (!isChecked) {
                isValid = false;
                errorMessage = 'Please select an option.';
            }
        }

        // Select validation
        if (field.tagName === 'SELECT' && field.hasAttribute('required') && !value) {
            isValid = false;
            errorMessage = 'Please select an option.';
        }

        // Only show error if requested (used for blur events)
        if (!isValid && showError) {
            this.showError(field, errorMessage);
        }

        return isValid;
    }

    validateForm() {
        const fields = this.form.querySelectorAll('input[required], textarea[required], select[required]');
        let isFormValid = true;

        fields.forEach(field => {
            if (!this.validateField(field)) {
                isFormValid = false;
            }
        });

        // Validate payment method checkboxes (required)
        const paymentCheckboxes = this.form.querySelectorAll('input[name="paymentMethod"]');
        const isPaymentSelected = Array.from(paymentCheckboxes).some(checkbox => checkbox.checked);
        
        if (!isPaymentSelected) {
            isFormValid = false;
            // Add error message for payment methods
            const paymentSection = paymentCheckboxes[0].closest('.form-group');
            const existingError = paymentSection.querySelector('.error-message');
            if (!existingError) {
                const errorDiv = document.createElement('div');
                errorDiv.className = 'error-message show';
                errorDiv.textContent = this.getTranslation('validation.payment_required');
                paymentSection.appendChild(errorDiv);
            }
        } else {
            // Remove error message if payment is selected
            const paymentSection = paymentCheckboxes[0].closest('.form-group');
            const existingError = paymentSection.querySelector('.error-message');
            if (existingError) {
                existingError.remove();
            }
        }

        // Shipping address validation removed - fields are hidden

        // Validate radio groups separately
        const radioGroups = ['interestLevel', 'packagePreferred'];
        radioGroups.forEach(groupName => {
            const radioGroup = this.form.querySelectorAll(`input[name="${groupName}"]`);
            if (radioGroup.length > 0) {
                const isChecked = Array.from(radioGroup).some(radio => radio.checked);
                if (!isChecked) {
                    this.showError(radioGroup[0], this.getTranslation('validation.radio_required'));
                    isFormValid = false;
                }
            }
        });

        return isFormValid;
    }

    showError(field, message) {
        field.classList.add('error');
        
        // For radio buttons, show error after the radio group
        if (field.type === 'radio') {
            const radioGroup = this.form.querySelectorAll(`input[name="${field.name}"]`);
            const lastRadio = radioGroup[radioGroup.length - 1];
            const parentContainer = lastRadio.closest('.form-section');
            
            let errorElement = parentContainer.querySelector('.error-message');
            if (!errorElement) {
                errorElement = document.createElement('div');
                errorElement.className = 'error-message';
                parentContainer.appendChild(errorElement);
            }
            errorElement.textContent = message;
            errorElement.classList.add('show');
        } else {
            // For other fields, show error after the field
            let errorElement = field.parentNode.querySelector('.error-message');
            if (!errorElement) {
                errorElement = document.createElement('div');
                errorElement.className = 'error-message';
                field.parentNode.appendChild(errorElement);
            }
            errorElement.textContent = message;
            errorElement.classList.add('show');
        }
    }

    removeErrorMessage(field) {
        field.classList.remove('error');
        
        if (field.type === 'radio') {
            const parentContainer = field.closest('.form-section');
            const errorElement = parentContainer.querySelector('.error-message');
            if (errorElement) {
                errorElement.remove();
            }
        } else {
            const errorElement = field.parentNode.querySelector('.error-message');
            if (errorElement) {
                errorElement.remove();
            }
        }
    }

    handleRealTimeValidation(e) {
        const field = e.target;
        
        // Clear any existing error state first
        this.removeErrorMessage(field);
        field.classList.remove('error', 'valid');
        
        // Skip validation for empty optional fields
        if (!field.hasAttribute('required') && !field.value.trim()) {
            return;
        }
        
        // Validate the field and provide visual feedback
        const isValid = this.validateField(field, false); // false = don't show error message yet
        
        if (field.value.trim()) {
            if (isValid) {
                field.classList.add('valid');
            } else {
                field.classList.add('error');
            }
        }
    }
    
    handleFieldBlur(e) {
        const field = e.target;
        
        // Only validate on blur if field has content or is required
        if (field.hasAttribute('required') || field.value.trim()) {
            this.validateField(field, true); // true = show error messages
        }
    }
    
    clearError(e) {
        const field = e.target;
        this.removeErrorMessage(field);
        field.classList.remove('error', 'valid');
    }

    getFormData() {
        const formData = new FormData(this.form);
        const data = {};
        
        // Handle regular form fields
        for (let [key, value] of formData.entries()) {
            // Handle checkbox arrays (like payment methods)
            if (key === 'paymentMethod') {
                if (!data[key]) {
                    data[key] = [];
                }
                data[key].push(value);
            } else {
                data[key] = value;
            }
        }
        
        // Convert payment method array to string for compatibility
        if (Array.isArray(data.paymentMethod)) {
            let paymentMethods = data.paymentMethod;
            
            // Handle "other" payment method
            if (paymentMethods.includes('other')) {
                const otherPaymentMethod = data.otherPaymentMethod;
                if (otherPaymentMethod && otherPaymentMethod.trim()) {
                    // Replace 'other' with the actual specified method
                    paymentMethods = paymentMethods.map(method => 
                        method === 'other' ? otherPaymentMethod.trim() : method
                    );
                }
            }
            
            // Join multiple payment methods with comma separator
            data.paymentMethod = paymentMethods.join(', ');
        } else if (!data.paymentMethod) {
            // If no payment methods selected, set empty string
            data.paymentMethod = '';
        }
        
        // Add timestamp
        data.submissionTime = new Date().toISOString();
        
        return data;
    }

    async handleSubmit(e) {
        e.preventDefault();
        
        if (!this.validateForm()) {
            this.scrollToFirstError();
            return;
        }

        this.setLoadingState(true);
        
        try {
            const formData = this.getFormData();
            
            // Submit to both Supabase and Google Sheets
            const results = await Promise.allSettled([
                this.submitToAPI(formData), // Supabase
                submitToGoogleSheets(formData) // Google Sheets
            ]);
            
            const supabaseResult = results[0];
            const googleSheetsResult = results[1];
            
            // Check if at least one submission succeeded
            let successCount = 0;
            let errors = [];
            
            if (supabaseResult.status === 'fulfilled') {
                console.log('✅ Supabase submission successful');
                successCount++;
            } else {
                console.error('❌ Supabase submission failed:', supabaseResult.reason);
                errors.push('Database: ' + supabaseResult.reason.message);
            }
            
            if (googleSheetsResult.status === 'fulfilled') {
                console.log('✅ Google Sheets submission successful');
                successCount++;
            } else {
                console.error('❌ Google Sheets submission failed:', googleSheetsResult.reason);
                errors.push('Spreadsheet: ' + googleSheetsResult.reason.message);
            }
            
            if (successCount > 0) {
                // At least one submission succeeded
                this.showSuccessMessage(supabaseResult.status === 'fulfilled' ? supabaseResult.value : null);
                this.resetForm();
                
                // If only partial success, log warnings
                if (errors.length > 0) {
                    console.warn('⚠️ Partial submission success. Errors:', errors);
                }
            } else {
                // Both submissions failed
                throw new Error('All submission methods failed: ' + errors.join(', '));
            }
            
        } catch (error) {
            console.error('Submission error:', error);
            this.showErrorMessage(`There was an error submitting your information: ${error.message}. Please try again.`);
        } finally {
            this.setLoadingState(false);
        }
    }

    async submitToAPI(data) {
        const client = getSupabaseClient();
        if (!client) {
            throw new Error('Supabase client not initialized. Please check your configuration.');
        }

        try {
            // Prepare data for Supabase submission
            const submissionData = {
                referred_by_first_name: data.referrerFirstName,
                referred_by_last_name: data.referrerLastName,
                referred_by_mobile: data.referrerMobile,
                interest_level: data.interestLevel,
                package_preferred: data.packagePreferred,
                payment_method: data.paymentMethod,
                contact_first_name: data.firstName,
                contact_last_name: data.lastName,
                contact_mobile: data.mobile,
                contact_email: data.email,
                mailing_address: data.mailingAddress,
                shipping_address: data.shippingAddress || null,
                same_as_mailing: data.sameAsMailingAddress === 'on',
                notes: data.notes || null,
                submission_time: data.submissionTime,
                user_agent: navigator.userAgent
            };

            console.log('📤 Submitting to Supabase:', submissionData);

            // Submit to Supabase
            const { data: result, error } = await client
                .from('lead_submissions')
                .insert([submissionData])
                .select();

            if (error) {
                console.error('❌ Supabase submission error:', error);
                throw new Error(`Database error: ${error.message}`);
            }

            console.log('✅ Successfully submitted to Supabase:', result);
            
            // Also store in localStorage as backup
            const submissions = JSON.parse(localStorage.getItem('7kMetalsSubmissions') || '[]');
            submissions.push({ ...data, supabaseId: result[0]?.id });
            localStorage.setItem('7kMetalsSubmissions', JSON.stringify(submissions));

            return result[0];
        } catch (error) {
            console.error('❌ Submission error:', error);
            
            // Fallback: store in localStorage if Supabase fails
            const submissions = JSON.parse(localStorage.getItem('7kMetalsSubmissions') || '[]');
            submissions.push({ ...data, status: 'failed', error: error.message });
            localStorage.setItem('7kMetalsSubmissions', JSON.stringify(submissions));
            
            throw error;
        }
    }

    setLoadingState(isLoading) {
        if (isLoading) {
            this.submitButton.disabled = true;
            this.submitButton.classList.add('loading');
            this.submitButton.textContent = 'Submitting...';
            this.form.classList.add('loading');
        } else {
            this.submitButton.disabled = false;
            this.submitButton.classList.remove('loading');
            this.submitButton.textContent = 'Submit Registration';
            this.form.classList.remove('loading');
        }
    }

    showSuccessMessage(submissionResult = null) {
        const successMessage = document.createElement('div');
        successMessage.className = 'success-message show';
        
        successMessage.innerHTML = `
            <h3>Registration Successful!</h3>
            <p>Thank you for your interest in the 7k Metals South America Pre-Launch. We'll contact you soon with more details.</p>
            <p><small>Your submission has been securely recorded in our database.</small></p>
        `;
        
        this.form.parentNode.insertBefore(successMessage, this.form);
        
        // Scroll to success message
        successMessage.scrollIntoView({ behavior: 'smooth', block: 'start' });
        
        // Hide success message after 12 seconds
        setTimeout(() => {
            successMessage.remove();
        }, 12000);
    }

    showErrorMessage(message) {
        const errorMessage = document.createElement('div');
        errorMessage.className = 'error-message show';
        errorMessage.style.background = 'var(--error-red)';
        errorMessage.style.color = 'var(--white)';
        errorMessage.style.padding = '20px';
        errorMessage.style.borderRadius = '8px';
        errorMessage.style.marginBottom = '20px';
        errorMessage.style.textAlign = 'center';
        errorMessage.textContent = message;
        
        this.form.parentNode.insertBefore(errorMessage, this.form);
        
        // Remove error message after 5 seconds
        setTimeout(() => {
            errorMessage.remove();
        }, 5000);
    }

    scrollToFirstError() {
        const firstError = this.form.querySelector('.error, .error-message.show');
        if (firstError) {
            firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }

    resetForm() {
        this.form.reset();
        
        // Clear any remaining error states
        const errorFields = this.form.querySelectorAll('.error');
        errorFields.forEach(field => field.classList.remove('error'));
        
        const errorMessages = this.form.querySelectorAll('.error-message');
        errorMessages.forEach(message => message.remove());
        
        // Reset shipping address state
        this.shippingAddress.disabled = false;
        this.shippingAddress.style.backgroundColor = '';
    }
}

// International phone number formatting (South America friendly)
function formatPhoneNumber(input) {
    let value = input.value;
    
    // Don't format if user is typing a + at the beginning
    if (value === '+') {
        return;
    }
    
    // Preserve + at the beginning and remove other non-digits
    let hasPlus = value.startsWith('+');
    let cleaned = value.replace(/[^\d]/g, '');
    
    if (hasPlus && cleaned) {
        // International format - minimal formatting to preserve flexibility
        // Just add spaces every 3-4 digits for readability
        if (cleaned.length > 2) {
            let countryCode = cleaned.substring(0, 2);
            let number = cleaned.substring(2);
            
            // Add spaces for readability: +XX XXX XXX XXXX
            if (number.length > 6) {
                number = number.replace(/(\d{3})(\d{3})(\d+)/, '$1 $2 $3');
            } else if (number.length > 3) {
                number = number.replace(/(\d{3})(\d+)/, '$1 $2');
            }
            
            input.value = '+' + countryCode + (number ? ' ' + number : '');
        } else {
            input.value = '+' + cleaned;
        }
    } else if (cleaned) {
        // Local format - add spaces for readability
        if (cleaned.length > 7) {
            // Format as XXX XXX XXXX for longer numbers
            input.value = cleaned.replace(/(\d{3})(\d{3})(\d+)/, '$1 $2 $3');
        } else if (cleaned.length > 4) {
            // Format as XXX XXXX for medium numbers
            input.value = cleaned.replace(/(\d{3})(\d+)/, '$1 $2');
        } else {
            input.value = cleaned;
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize Supabase first
    const supabaseInitialized = initializeSupabase();
    
    if (supabaseInitialized) {
        // Test connection (optional)
        testSupabaseConnection();
    } else {
        console.warn('⚠️ Supabase initialization failed. Form will use localStorage fallback.');
    }
    
    // Initialize form
    new LeadCaptureForm();
    
    // Add phone formatting to phone fields
    const phoneFields = document.querySelectorAll('input[type="tel"]');
    phoneFields.forEach(field => {
        field.addEventListener('input', () => formatPhoneNumber(field));
    });
    
    // Add smooth scrolling for better UX
    document.documentElement.style.scrollBehavior = 'smooth';
    
    // Console welcome message
    console.log('🥇 7k Metals South America Pre-Launch Lead Capture Form Initialized');
    console.log('📊 Form submissions are stored in Supabase database and localStorage');
});