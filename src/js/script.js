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
        this.form.addEventListener('input', this.clearError.bind(this));
        this.form.addEventListener('change', this.clearError.bind(this));
    }

    setupAddressSync() {
        this.sameAddressCheckbox.addEventListener('change', (e) => {
            if (e.target.checked) {
                this.shippingAddress.value = this.mailingAddress.value;
                this.shippingAddress.disabled = true;
                this.shippingAddress.style.backgroundColor = '#f5f5f5';
            } else {
                this.shippingAddress.disabled = false;
                this.shippingAddress.style.backgroundColor = '';
            }
        });

        this.mailingAddress.addEventListener('input', () => {
            if (this.sameAddressCheckbox.checked) {
                this.shippingAddress.value = this.mailingAddress.value;
            }
        });
    }

    setupPaymentMethodToggle() {
        const paymentMethod = document.getElementById('paymentMethod');
        const otherPaymentContainer = document.getElementById('otherPaymentContainer');
        
        paymentMethod.addEventListener('change', (e) => {
            if (e.target.value === 'other') {
                otherPaymentContainer.style.display = 'block';
            } else {
                otherPaymentContainer.style.display = 'none';
                // Clear the other payment method field when not needed
                document.getElementById('otherPaymentMethod').value = '';
            }
        });
    }

    validateField(field) {
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
            errorMessage = 'This field is required.';
        }

        // Email validation
        if (fieldType === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
                errorMessage = 'Please enter a valid email address.';
            }
        }

        // Phone validation
        if (fieldType === 'tel' && value) {
            const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
            if (!phoneRegex.test(value.replace(/[\s\-\(\)]/g, ''))) {
                isValid = false;
                errorMessage = 'Please enter a valid phone number.';
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

        if (!isValid) {
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

        // Validate radio groups separately
        const radioGroups = ['interestLevel', 'packagePreferred'];
        radioGroups.forEach(groupName => {
            const radioGroup = this.form.querySelectorAll(`input[name="${groupName}"]`);
            if (radioGroup.length > 0) {
                const isChecked = Array.from(radioGroup).some(radio => radio.checked);
                if (!isChecked) {
                    this.showError(radioGroup[0], 'Please select an option.');
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

    clearError(e) {
        const field = e.target;
        this.removeErrorMessage(field);
    }

    getFormData() {
        const formData = new FormData(this.form);
        const data = {};
        
        for (let [key, value] of formData.entries()) {
            data[key] = value;
        }
        
        // Handle "other" payment method
        if (data.paymentMethod === 'other') {
            const otherPaymentMethod = data.otherPaymentMethod;
            data.paymentMethod = otherPaymentMethod && otherPaymentMethod.trim() ? otherPaymentMethod.trim() : 'other';
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
            
            // Submit to Supabase
            const result = await this.submitToAPI(formData);
            
            this.showSuccessMessage(result);
            this.resetForm();
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

// Phone number formatting
function formatPhoneNumber(input) {
    // Remove all non-digit characters
    let cleaned = input.value.replace(/\D/g, '');
    
    // Format as (XXX) XXX-XXXX for US numbers
    if (cleaned.length >= 10) {
        let formatted = cleaned.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
        if (cleaned.length > 10) {
            formatted = '+' + cleaned.substring(0, cleaned.length - 10) + ' ' + formatted;
        }
        input.value = formatted;
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