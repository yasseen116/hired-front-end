const { createApp } = Vue;

createApp({
    data() {
        return {
            email: '',
            password: '',
            rememberMe: false,
            isLoading: false,
            errorMessage: null
        }
    },
    
    methods: {
        async handleLogin() {
            this.isLoading = true;
            this.errorMessage = null;

            // 1. Basic Validation
            if (!this.email || !this.password) {
                this.errorMessage = "Please fill in all fields.";
                this.isLoading = false;
                return;
            }

            try {
                console.log("Attempting login for:", this.email);
                
                // Simulate network delay (1.5 seconds)
                await new Promise(resolve => setTimeout(resolve, 1500));

                // 2. CREATE FAKE USER DATA
                const fakeName = this.email.split('@')[0];
                const user = {
                    name: fakeName,
                    email: this.email,
                    token: "mock-token-12345"
                };

                // 3. SAVE TO LOCAL STORAGE (Crucial Step!)
                // This saves the user so the Navbar can find it
                localStorage.setItem('user', JSON.stringify(user));

                // 4. REDIRECT TO HOME PAGE
                window.location.href = '/preview/index.html';

            } catch (error) {
                console.error(error);
                this.errorMessage = "Invalid email or password.";
                this.isLoading = false;
            }
        }
    },
    
    compilerOptions: {
        delimiters: ['[[', ']]'] 
    }
}).mount('#app');