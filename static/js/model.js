const JobModel = {
    // 1. The "Database" - Holds all job data in one place
    _data: [
        {
            id: 1,
            title: "Software Engineer",
            company: "Fawry",
            location: "Smart Village",
            experience: "0-5 Years",
            salary: "Negotiable",
            logoUrl: "../static/images/companies/fawry.png",
            type: "On-site",
            description: [
                "We are seeking a highly experienced Senior Software Testing Engineer to lead end-to-end testing activities across web, mobile, backend services, and integrated systems.",
                "The ideal candidate has strong analytical skills, deep knowledge of testing methodologies, and the ability to ensure product quality within fast-paced Agile environments."
            ],
            responsibilities: [
                "Test Planning & Strategy: Develop comprehensive test plans.",
                "Test Case Design & Execution.",
                "Automation Testing using Selenium or Cypress.",
                "API & Backend Testing using Postman.",
                "Performance & Security Testing.",
                "Collaboration & Leadership within the agile team.",
                "Reporting & Documentation of bugs and fixes."
            ],
            softSkills: [
                "Strong ownership and accountability",
                "Leadership & mentoring abilities",
                "Attention to detail",
                "Problem-solving mindset",
                "Excellent documentation and communication skills"
            ],
            qualifications: [
                "Experience with microservices and distributed systems.",
                "Automation experience using Python, Java, or JavaScript."
            ]
        },
        {
            id: 2,
            title: "Architectural Engineer",
            company: "Palm Hills",
            location: "Giza",
            experience: "0-5 Years",
            salary: "Negotiable",
            logoUrl: "../static/images/companies/palm.png",
            type: "On-site",
            description: [
                "Responsible for designing, planning, and overseeing the construction of new building projects.",
                "Ensuring that designs meet client specifications and building codes."
            ],
            responsibilities: [
                "Prepare architectural drawings and specifications.",
                "Coordinate with construction teams and project managers.",
                "Ensure compliance with safety standards and regulations.",
                "Conduct site visits to monitor progress."
            ],
            softSkills: [
                "Creative thinking",
                "Project management",
                "Strong communication skills",
                "Attention to detail"
            ],
            qualifications: [
                "Proficiency in AutoCAD and Revit.",
                "Previous experience in residential projects."
            ]
        },
        {
            id: 3,
            title: "Software Developer",
            company: "IBM",
            location: "Alexandria",
            experience: "1-3 Years",
            salary: "Negotiable",
            logoUrl: "../static/images/companies/ibm.png",
            type: "On-site",
            description: [
                "lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut",
                "lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut"
            ],
            responsibilities: [
                "Review prescriptions for accuracy.",
                "Advise patients on drug interactions and side effects.",
                "Maintain patient records.",
                "Supervise pharmacy technicians."
            ],
            softSkills: [
                "Customer service orientation",
                "Attention to detail",
                "Integrity and ethical behavior"
            ],
            qualifications: [
                "License to practice pharmacy in Egypt.",
                "Experience with pharmacy management software."
            ]
        },
        {
            id: 4,
            title: "Cashier",
            company: "Monginis",
            location: "Zagazig",
            experience: "Not Required",
            salary: "3 K – 5 K / month",
            logoUrl: null,
            type: "On-site",
            description: [
                "Handling cash transactions and providing excellent customer service at the checkout counter."
            ],
            responsibilities: [
                "Scan items and collect payments.",
                "Issue receipts and refunds.",
                "Maintain a clean and organized checkout area.",
                "Resolve customer complaints politely."
            ],
            softSkills: [
                "Honesty and reliability",
                "Basic math skills",
                "Friendly demeanor"
            ],
            qualifications: [
                "Previous retail experience is a plus but not required."
            ]
        },
        {
            id: 5,
            title: "Sales Associate",
            company: "Town Team",
            location: "Banha",
            experience: "Not Required",
            salary: "5 K – 8 K / month",
            logoUrl: null,
            type: "On-site",
            description: [
                "Assisting customers in finding products and driving sales in a retail environment."
            ],
            responsibilities: [
                "Greet customers and offer assistance.",
                "Demonstrate product features.",
                "Maintain stock on shelves.",
                "Process sales transactions."
            ],
            softSkills: [
                "Persuasive communication",
                "Energetic and positive attitude",
                "Team player"
            ],
            qualifications: [
                "Interest in fashion and retail trends."
            ]
        },
        {
            id: 6,
            title: "Quality Control Assistant",
            company: "Eva Pharma",
            location: "Cairo",
            experience: "2-4 Years",
            salary: "Negotiable",
            logoUrl: null,
            type: "On-site",
            description: [
                "Ensuring that pharmaceutical products meet established quality standards and regulations."
            ],
            responsibilities: [
                "Perform inspections on raw materials and finished products.",
                "Document quality control data.",
                "Identify and report deviations.",
                "Assist in internal audits."
            ],
            softSkills: [
                "Analytical thinking",
                "Precision and accuracy",
                "Organizational skills"
            ],
            qualifications: [
                "Degree in Chemistry or Pharmacy.",
                "Knowledge of GMP (Good Manufacturing Practices)."
            ]
        },
        {
            id: 7,
            title: "Customer Service Agent",
            company: "Bank Misr",
            location: "Maadi Branch 1",
            experience: "2-5 Years",
            salary: "Negotiable",
            logoUrl: "../static/images/companies/nbe.png",
            type: "On-site",
            description: [
                "Serving as the first point of contact for bank customers, handling inquiries and resolving issues."
            ],
            responsibilities: [
                "Answer customer queries via phone or in-person.",
                "Assist with account opening and transactions.",
                "Promote bank products and services.",
                "Handle complaints efficiently."
            ],
            softSkills: [
                "Patience and empathy",
                "Clear communication",
                "Problem-solving"
            ],
            qualifications: [
                "Banking or financial background.",
                "Fluency in English."
            ]
        },
        {
            id: 8,
            title: "UI/UX Designer",
            company: "LC Waikiki",
            location: "Remote",
            experience: "Not Required",
            salary: "Negotiable",
            logoUrl: "../static/images/companies/lcwaikiki.png",
            type: "Remote",
            description: [
                "Designing user-friendly interfaces for web and mobile applications to enhance user experience."
            ],
            responsibilities: [
                "Create wireframes, prototypes, and high-fidelity designs.",
                "Conduct user research and usability testing.",
                "Collaborate with developers to implement designs.",
                "Maintain design consistency across platforms."
            ],
            softSkills: [
                "Creativity",
                "User-centric mindset",
                "Collaboration"
            ],
            qualifications: [
                "Portfolio demonstrating UI/UX projects.",
                "Proficiency in Figma or Adobe XD."
            ]
        }
    ],

    // 2. Service Method: Get All Jobs (Simulates an API call)
    // Used by: Homepage, Browse Page
    getAll() {
        return new Promise(resolve => {
            // Simulate a small network delay for realism
            setTimeout(() => {
                resolve(this._data);
            }, 300);
        });
    },

    // 3. Service Method: Get One Job by ID (Includes "Heavy" details)
    // Used by: Job Details Page
    getById(id) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const job = this._data.find(j => j.id == id);
                if (job) {
                    resolve(job);
                } else {
                    reject("Job not found");
                }
            }, 300);
        });
    },
    
    // 4. Helper: Get Similar Jobs based on title/category
    // Used by: Job Details Sidebar
    getSimilar(currentJobId, keyword) {
        if (!keyword) return [];
        const lowerKeyword = keyword.toLowerCase();
        
        return this._data
            .filter(job => 
                job.id != currentJobId && 
                (job.title.toLowerCase().includes(lowerKeyword) || 
                 job.company.toLowerCase().includes(lowerKeyword))
            )
            .slice(0, 5); // Return max 5 similar jobs
    }
};

const CompanyModel = {
    getTopCompanies() {
        return [
            { name: "LC Waikiki", logo: "../static/images/companies/lcwaikiki.png" },
            { name: "Elsewedy Electric", logo: "../static/images/companies/elsewedy.png" },
            { name: "Breadfast", logo: "../static/images/companies/breadfast.png" },
            { name: "IBM", logo: "../static/images/companies/ibm.png" },
            { name: "Microsoft", logo: "../static/images/companies/microsoft.png" },
            { name: "Etoile", logo: "../static/images/companies/etoile.webp" },
            { name: "Google", logo: "../static/images/companies/google.png" },
            { name: "ValU", logo: "../static/images/companies/valu.webp" },
            { name: "Juhayna", logo: "../static/images/companies/juhayna.png" },
            { name: "CIB", logo: "../static/images/companies/cib.png" },
            { name: "Orascom", logo: "../static/images/companies/orascom.png" },
            { name: "Fawry", logo: "../static/images/companies/fawry.png" },
            { name: "Palm Hills", logo: "../static/images/companies/palm.png" },
            { name: "Vodafone", logo: "../static/images/companies/vodafone.png" },
            { name: "NBE", logo: "../static/images/companies/nbe.png" },
            { name: "Edita", logo: "../static/images/companies/edita.png" }
        ];
    }
};