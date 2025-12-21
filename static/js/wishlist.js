const { createApp } = Vue;

createApp({
    data() {
        return {
            isLoading: true,
            savedJobs: [] 
        }
    },

    async mounted() {
        await this.loadWishlist();
    },

    methods: {
        async loadWishlist() {
            try {
                const wishlistIds = JSON.parse(localStorage.getItem('my_wishlist')) || [];

                if (wishlistIds.length === 0) {
                    this.savedJobs = [];
                    this.isLoading = false;
                    return;
                }

                const allJobs = await JobModel.getAll();

                this.savedJobs = allJobs.filter(job => wishlistIds.includes(String(job.id)));

            } catch (error) {
                console.error("Error loading wishlist:", error);
            } finally {
                this.isLoading = false;
            }
        },

        removeFromWishlist(jobId) {
            const idToRemove = String(jobId);
            
            let list = JSON.parse(localStorage.getItem('my_wishlist')) || [];
            list = list.filter(id => id !== idToRemove);
            localStorage.setItem('my_wishlist', JSON.stringify(list));

            // Remove from the UI
            this.savedJobs = this.savedJobs.filter(job => String(job.id) !== idToRemove);
        },

        goToDetails(jobId) {
            window.location.href = `/preview/job-details.html?id=${jobId}`;
        }
    },

    compilerOptions: {
        delimiters: ['[[', ']]']
    }
}).mount('#wishlist-app');