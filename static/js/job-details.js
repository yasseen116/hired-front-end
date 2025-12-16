const { createApp } = Vue;

createApp({
    data() {
        return {
            loading: true,
            job: {}, // Starts empty
            similarJobs: []
        }
    },
    async mounted() {
        // 1. Get the Job ID from the URL (e.g., job-details.html?id=1)
        const urlParams = new URLSearchParams(window.location.search);
        const jobId = urlParams.get('id') || 1; // Default to ID 1 for testing

        try {
            // 2. Ask the Model for data
            this.job = await JobModel.getById(jobId);
            
            // 3. Ask Model for similar jobs based on title (e.g., "Engineer")
            // Simple logic: take the first word of the title
            const keyword = this.job.title.split(' ')[0];
            this.similarJobs = JobModel.getSimilar(jobId, keyword);

        } catch (error) {
            console.error(error);
            alert("Job not found!");
        } finally {
            this.loading = false;
        }
    },
    compilerOptions: {
        delimiters: ['[[', ']]']
    }
}).mount('#app');