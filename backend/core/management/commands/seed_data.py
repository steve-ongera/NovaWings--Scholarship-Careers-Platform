# core/management/commands/seed_data.py
"""
Custom Django management command to seed the NovaWings platform with initial test data.
Run with: python manage.py seed_data
"""

from django.core.management.base import BaseCommand
from django.contrib.auth.hashers import make_password
from django.utils.text import slugify
from django.utils import timezone
from datetime import datetime, timedelta
import random
from decimal import Decimal

from core.models import (
    User, Destination, Scholarship, ScholarshipUnlock, ScholarshipApplication,
    ApplicationStageLog, ApplicationDocument, JobCategory, Job, JobApplication,
    JobApplicationDocument, Payment, ContactEnquiry, Notification
)


class Command(BaseCommand):
    help = "Seeds the database with realistic test data for NovaWings platform"

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS("🌱 Starting database seeding..."))
        
        # Clear existing data (optional - comment out if you want to preserve)
        self.clear_existing_data()
        
        # Create destinations
        destinations = self.create_destinations()
        
        # Create users
        users = self.create_users()
        
        # Create scholarships
        scholarships = self.create_scholarships(destinations, users)
        
        # Create scholarship unlocks (payments)
        self.create_scholarship_unlocks(users, scholarships)
        
        # Create scholarship applications
        self.create_scholarship_applications(users, scholarships)
        
        # Create job categories
        categories = self.create_job_categories()
        
        # Create jobs
        jobs = self.create_jobs(categories, users)
        
        # Create job applications
        self.create_job_applications(users, jobs)
        
        # Create contact enquiries
        self.create_contact_enquiries()
        
        # Create notifications
        self.create_notifications(users)
        
        self.stdout.write(self.style.SUCCESS("✅ Database seeding completed successfully!"))
    
    def clear_existing_data(self):
        """Clear existing data from all models."""
        self.stdout.write("Clearing existing data...")
        Notification.objects.all().delete()
        ContactEnquiry.objects.all().delete()
        Payment.objects.all().delete()
        JobApplicationDocument.objects.all().delete()
        JobApplication.objects.all().delete()
        Job.objects.all().delete()
        JobCategory.objects.all().delete()
        ApplicationDocument.objects.all().delete()
        ApplicationStageLog.objects.all().delete()
        ScholarshipApplication.objects.all().delete()
        ScholarshipUnlock.objects.all().delete()
        Scholarship.objects.all().delete()
        User.objects.filter(is_superuser=False).delete()
        Destination.objects.all().delete()
        self.stdout.write("Existing data cleared.")
    
    def create_destinations(self):
        """Create study destinations."""
        destinations_data = [
            {"name": "Canada", "code": "CA", "flag_emoji": "🇨🇦"},
            {"name": "United States", "code": "US", "flag_emoji": "🇺🇸"},
            {"name": "United Kingdom", "code": "GB", "flag_emoji": "🇬🇧"},
            {"name": "Australia", "code": "AU", "flag_emoji": "🇦🇺"},
            {"name": "Germany", "code": "DE", "flag_emoji": "🇩🇪"},
            {"name": "Netherlands", "code": "NL", "flag_emoji": "🇳🇱"},
            {"name": "Sweden", "code": "SE", "flag_emoji": "🇸🇪"},
            {"name": "Ireland", "code": "IE", "flag_emoji": "🇮🇪"},
        ]
        
        destinations = []
        for data in destinations_data:
            dest, created = Destination.objects.get_or_create(
                code=data["code"],
                defaults={
                    "name": data["name"],
                    "flag_emoji": data["flag_emoji"],
                    "is_active": True
                }
            )
            destinations.append(dest)
            if created:
                self.stdout.write(f"  ✓ Created destination: {dest.name}")
        
        return destinations
    
    def create_users(self):
        """Create admin, staff, and student users."""
        users = {}
        
        # Admin user
        admin = User.objects.create_superuser(
            username="admin@novawings.com",
            email="admin@novawings.com",
            password="Admin@123",
            first_name="John",
            last_name="Mwangi",
            role=User.ROLE_ADMIN,
            phone="+254700000001",
            country="Kenya",
            city="Nairobi",
            is_verified=True
        )
        users["admin"] = admin
        self.stdout.write("  ✓ Created admin user")
        
        # Staff users
        staff_data = [
            {"username": "staff_jane@novawings.com", "email": "staff_jane@novawings.com", "first_name": "Jane", "last_name": "Omondi", "phone": "+254700000002"},
            {"username": "staff_peter@novawings.com", "email": "staff_peter@novawings.com", "first_name": "Peter", "last_name": "Mutua", "phone": "+254700000003"},
        ]
        
        staff_users = []
        for data in staff_data:
            staff = User.objects.create_user(
                username=data["username"],
                email=data["email"],
                password="Staff@123",
                first_name=data["first_name"],
                last_name=data["last_name"],
                role=User.ROLE_STAFF,
                phone=data["phone"],
                country="Kenya",
                city="Nairobi",
                is_verified=True
            )
            staff_users.append(staff)
            self.stdout.write(f"  ✓ Created staff user: {staff.first_name} {staff.last_name}")
        
        users["staff"] = staff_users
        
        # Student users
        student_data = [
            {"username": "student_emily", "email": "emily.wanjiku@example.com", "first_name": "Emily", "last_name": "Wanjiku", "phone": "+254712345678", "city": "Nairobi"},
            {"username": "student_james", "email": "james.otieno@example.com", "first_name": "James", "last_name": "Otieno", "phone": "+254723456789", "city": "Kisumu"},
            {"username": "student_mary", "email": "mary.njeri@example.com", "first_name": "Mary", "last_name": "Njeri", "phone": "+254734567890", "city": "Mombasa"},
            {"username": "student_david", "email": "david.mwangi@example.com", "first_name": "David", "last_name": "Mwangi", "phone": "+254745678901", "city": "Nakuru"},
            {"username": "student_sarah", "email": "sarah.kimani@example.com", "first_name": "Sarah", "last_name": "Kimani", "phone": "+254756789012", "city": "Eldoret"},
            {"username": "student_michael", "email": "michael.okoth@example.com", "first_name": "Michael", "last_name": "Okoth", "phone": "+254767890123", "city": "Thika"},
            {"username": "student_grace", "email": "grace.akinyi@example.com", "first_name": "Grace", "last_name": "Akinyi", "phone": "+254778901234", "city": "Nyeri"},
            {"username": "student_brian", "email": "brian.kariuki@example.com", "first_name": "Brian", "last_name": "Kariuki", "phone": "+254789012345", "city": "Kisumu"},
        ]
        
        student_users = []
        for data in student_data:
            student = User.objects.create_user(
                username=data["username"],
                email=data["email"],
                password="Student@123",
                first_name=data["first_name"],
                last_name=data["last_name"],
                role=User.ROLE_STUDENT,
                phone=data["phone"],
                country="Kenya",
                city=data["city"],
                is_verified=True,
                bio=f"Student interested in studying abroad. Looking for scholarship opportunities in {random.choice(['Canada', 'USA', 'UK', 'Australia'])}."
            )
            student_users.append(student)
            self.stdout.write(f"  ✓ Created student user: {student.first_name} {student.last_name}")
        
        users["students"] = student_users
        
        return users
    
    def create_scholarships(self, destinations, users):
        """Create scholarship listings."""
        scholarships = []
        
        scholarships_data = [
            {
                "title": "University of Toronto Excellence Scholarship",
                "destination": "Canada",
                "level": Scholarship.LEVEL_DEGREE,
                "tier": Scholarship.TIER_GOLD,
                "description": "Full tuition scholarship for outstanding international students at the University of Toronto.",
                "requirements": "Minimum 85% average in high school, IELTS 6.5 or equivalent",
                "benefits": "Full tuition coverage for 4 years + living stipend of CAD 5,000/year",
                "amount_usd": 49.99,
                "amount_kes": 6499,
                "deadline": timezone.now().date() + timedelta(days=60),
                "university": "University of Toronto",
                "field_of_study": "Engineering, Computer Science, Business",
                "visa_assistance": True,
                "is_featured": True
            },
            {
                "title": "Rhodes Scholarship at Oxford",
                "destination": "United Kingdom",
                "level": Scholarship.LEVEL_MASTERS,
                "tier": Scholarship.TIER_GOLD,
                "description": "Prestigious scholarship for postgraduate study at the University of Oxford.",
                "requirements": "Exceptional academic record, leadership potential, aged 18-24",
                "benefits": "Full tuition, living stipend, health insurance, travel allowance",
                "amount_usd": 99.99,
                "amount_kes": 12999,
                "deadline": timezone.now().date() + timedelta(days=30),
                "university": "University of Oxford",
                "field_of_study": "All fields",
                "visa_assistance": True,
                "is_featured": True
            },
            {
                "title": "DAAD Scholarship for Development-Related Courses",
                "destination": "Germany",
                "level": Scholarship.LEVEL_MASTERS,
                "tier": Scholarship.TIER_PREMIUM,
                "description": "German government scholarship for students from developing countries.",
                "requirements": "Bachelor's degree with 2+ years work experience",
                "benefits": "Monthly stipend EUR 850 + travel and health insurance",
                "amount_usd": 29.99,
                "amount_kes": 3899,
                "deadline": timezone.now().date() + timedelta(days=90),
                "university": "Various German Universities",
                "field_of_study": "Development, Public Policy, Economics",
                "visa_assistance": True,
                "is_featured": True
            },
            {
                "title": "Australian Awards Scholarship",
                "destination": "Australia",
                "level": Scholarship.LEVEL_DEGREE,
                "tier": Scholarship.TIER_PREMIUM,
                "description": "Australian government scholarship for students from Africa and Asia.",
                "requirements": "Strong academic record, English proficiency",
                "benefits": "Full tuition, living expenses, travel allowance",
                "amount_usd": 39.99,
                "amount_kes": 5199,
                "deadline": timezone.now().date() + timedelta(days=45),
                "university": "Multiple Universities",
                "field_of_study": "Various",
                "visa_assistance": False,
                "is_featured": False
            },
            {
                "title": "MIT International Science and Technology Scholarship",
                "destination": "United States",
                "level": Scholarship.LEVEL_DEGREE,
                "tier": Scholarship.TIER_GOLD,
                "description": "Full scholarship for exceptional STEM students at MIT.",
                "requirements": "Outstanding SAT scores (1500+), research experience",
                "benefits": "Full tuition + research stipend + housing",
                "amount_usd": 79.99,
                "amount_kes": 10399,
                "deadline": timezone.now().date() + timedelta(days=120),
                "university": "Massachusetts Institute of Technology",
                "field_of_study": "STEM",
                "visa_assistance": True,
                "is_featured": True
            },
            {
                "title": "Vanier Canada Graduate Scholarship",
                "destination": "Canada",
                "level": Scholarship.LEVEL_PHD,
                "tier": Scholarship.TIER_PREMIUM,
                "description": "Prestigious doctoral scholarship for international students in Canada.",
                "requirements": "First-class standing, research excellence, leadership potential",
                "benefits": "CAD 50,000 per year for 3 years",
                "amount_usd": 59.99,
                "amount_kes": 7799,
                "deadline": timezone.now().date() + timedelta(days=75),
                "university": "Various Canadian Universities",
                "field_of_study": "Health, Natural Sciences, Engineering, Social Sciences",
                "visa_assistance": True,
                "is_featured": False
            },
            {
                "title": "Swedish Institute Scholarships",
                "destination": "Sweden",
                "level": Scholarship.LEVEL_MASTERS,
                "tier": Scholarship.TIER_FREE,
                "description": "Full scholarship for master's studies in Sweden.",
                "requirements": "Bachelor's degree, English proficiency, leadership experience",
                "benefits": "Tuition fees, living expenses SEK 11,000/month, travel grant",
                "amount_usd": None,
                "amount_kes": None,
                "deadline": timezone.now().date() + timedelta(days=50),
                "university": "Various Swedish Universities",
                "field_of_study": "Various",
                "visa_assistance": True,
                "is_featured": False
            },
            {
                "title": "Government of Ireland International Scholarship",
                "destination": "Ireland",
                "level": Scholarship.LEVEL_MASTERS,
                "tier": Scholarship.TIER_FREE,
                "description": "Full scholarship for high-caliber international students in Ireland.",
                "requirements": "Excellent academic record, research proposal",
                "benefits": "EUR 18,500 stipend + full fee waiver",
                "amount_usd": None,
                "amount_kes": None,
                "deadline": timezone.now().date() + timedelta(days=40),
                "university": "Various Irish Universities",
                "field_of_study": "All fields",
                "visa_assistance": False,
                "is_featured": False
            },
            {
                "title": "Erasmus Mundus Joint Master's Degree",
                "destination": "Netherlands",
                "level": Scholarship.LEVEL_MASTERS,
                "tier": Scholarship.TIER_FREE,
                "description": "European Union scholarship for joint master's programs.",
                "requirements": "Bachelor's degree, English proficiency",
                "benefits": "Full tuition + monthly stipend + travel costs",
                "amount_usd": None,
                "amount_kes": None,
                "deadline": timezone.now().date() + timedelta(days=25),
                "university": "Multiple European Universities",
                "field_of_study": "Various",
                "visa_assistance": True,
                "is_featured": True
            },
        ]
        
        for data in scholarships_data:
            destination = next((d for d in destinations if d.name == data["destination"]), None)
            if destination:
                slug = slugify(data["title"])
                scholarship, created = Scholarship.objects.get_or_create(
                    slug=slug,
                    defaults={
                        "id": None,
                        "title": data["title"],
                        "destination": destination,
                        "level": data["level"],
                        "tier": data["tier"],
                        "description": data["description"],
                        "requirements": data["requirements"],
                        "benefits": data["benefits"],
                        "amount_usd": data.get("amount_usd"),
                        "amount_kes": data.get("amount_kes"),
                        "deadline": data["deadline"],
                        "university": data.get("university", ""),
                        "field_of_study": data.get("field_of_study", ""),
                        "visa_assistance": data.get("visa_assistance", False),
                        "is_featured": data.get("is_featured", False),
                        "is_active": True,
                        "created_by": users["admin"]
                    }
                )
                scholarships.append(scholarship)
                if created:
                    self.stdout.write(f"  ✓ Created scholarship: {scholarship.title}")
        
        return scholarships
    
    def create_scholarship_unlocks(self, users, scholarships):
        """Create scholarship unlock records (paid scholarships)."""
        paid_scholarships = [s for s in scholarships if s.is_paid]
        
        if not paid_scholarships:
            return
        
        # Create unlocks for some students
        for i, student in enumerate(users["students"][:5]):
            if paid_scholarships:
                scholarship = random.choice(paid_scholarships)
                
                # Skip if already unlocked
                if ScholarshipUnlock.objects.filter(user=student, scholarship=scholarship).exists():
                    continue
                
                amount = scholarship.amount_usd or Decimal("29.99")
                
                unlock = ScholarshipUnlock.objects.create(
                    user=student,
                    scholarship=scholarship,
                    amount_paid=amount,
                    currency="USD",
                    method=random.choice(["mpesa", "paypal", "card"]),
                    status=ScholarshipUnlock.STATUS_SUCCESS,
                    reference=f"PAY-{uuid.uuid4().hex[:8].upper()}",
                    unlocked_at=timezone.now() - timedelta(days=random.randint(1, 30))
                )
                
                # Also create a payment record
                Payment.objects.create(
                    user=student,
                    purpose=Payment.PURPOSE_SCHOLARSHIP,
                    amount=amount,
                    currency="USD",
                    method=unlock.method,
                    status=Payment.STATUS_SUCCESS,
                    gateway_ref=unlock.reference,
                    metadata={"scholarship_id": str(scholarship.id), "unlock_id": str(unlock.id)}
                )
                
                self.stdout.write(f"  ✓ Student {student.username} unlocked scholarship: {scholarship.title}")
    
    def create_scholarship_applications(self, users, scholarships):
        """Create scholarship applications."""
        stages = [
            ScholarshipApplication.STAGE_SUBMITTED,
            ScholarshipApplication.STAGE_REVIEWING,
            ScholarshipApplication.STAGE_DOCS_OK,
            ScholarshipApplication.STAGE_VISA,
            ScholarshipApplication.STAGE_APPROVED,
            ScholarshipApplication.STAGE_REJECTED
        ]
        
        for student in users["students"][:6]:
            # Apply to 2-3 scholarships
            num_applications = random.randint(2, 4)
            selected_scholarships = random.sample(scholarships, min(num_applications, len(scholarships)))
            
            for scholarship in selected_scholarships:
                # Skip if already applied
                if ScholarshipApplication.objects.filter(user=student, scholarship=scholarship).exists():
                    continue
                
                stage = random.choice(stages)
                
                application = ScholarshipApplication.objects.create(
                    user=student,
                    scholarship=scholarship,
                    stage=stage,
                    personal_statement=f"My name is {student.first_name} {student.last_name} and I am very interested in this scholarship opportunity. I have strong academic background and leadership experience...",
                    needs_visa_help=scholarship.visa_assistance and random.choice([True, False]),
                    admin_notes=random.choice(["", "Application looks promising", "Needs additional documents", "Good fit for this program"]) if stage != ScholarshipApplication.STAGE_SUBMITTED else ""
                )
                
                # Create stage log
                ApplicationStageLog.objects.create(
                    application=application,
                    from_stage="",
                    to_stage=stage,
                    changed_by=random.choice(users["staff"] + [users["admin"]]),
                    note="Initial application submitted"
                )
                
                # Create some documents
                doc_types = ["passport", "transcript", "cv", "recommendation"]
                for doc_type in random.sample(doc_types, min(3, len(doc_types))):
                    ApplicationDocument.objects.create(
                        application=application,
                        doc_type=doc_type,
                        file=f"dummy_docs/{doc_type}_{student.username}.pdf",
                        is_verified=stage in [ScholarshipApplication.STAGE_DOCS_OK, ScholarshipApplication.STAGE_VISA, ScholarshipApplication.STAGE_APPROVED]
                    )
                
                self.stdout.write(f"  ✓ Student {student.username} applied to {scholarship.title} - Status: {stage}")
    
    def create_job_categories(self):
        """Create job categories."""
        categories_data = [
            {"name": "Technology & IT", "slug": "technology", "icon": "bi-laptop"},
            {"name": "Marketing & Sales", "slug": "marketing-sales", "icon": "bi-megaphone"},
            {"name": "Finance & Accounting", "slug": "finance", "icon": "bi-calculator"},
            {"name": "Healthcare", "slug": "healthcare", "icon": "bi-hospital"},
            {"name": "Education", "slug": "education", "icon": "bi-book"},
            {"name": "Engineering", "slug": "engineering", "icon": "bi-gear"},
            {"name": "Hospitality", "slug": "hospitality", "icon": "bi-cup-straw"},
            {"name": "Administration", "slug": "administration", "icon": "bi-briefcase"},
        ]
        
        categories = []
        for data in categories_data:
            category, created = JobCategory.objects.get_or_create(
                slug=data["slug"],
                defaults={"name": data["name"], "icon": data["icon"]}
            )
            categories.append(category)
            if created:
                self.stdout.write(f"  ✓ Created job category: {category.name}")
        
        return categories
    
    def create_jobs(self, categories, users):
        """Create job listings."""
        jobs_data = [
            {
                "title": "Senior Software Engineer",
                "company": "Safaricom",
                "location": "Nairobi, Kenya",
                "job_type": Job.TYPE_FULL_TIME,
                "description": "Looking for experienced software engineer to lead development of mobile applications.",
                "requirements": "5+ years experience in Python/Django, React, AWS",
                "salary_range": "KES 250,000 - 350,000",
                "deadline": timezone.now().date() + timedelta(days=20),
                "is_featured": True
            },
            {
                "title": "Digital Marketing Specialist",
                "company": "Jumia Kenya",
                "location": "Remote",
                "job_type": Job.TYPE_FULL_TIME,
                "description": "Manage social media campaigns, SEO, and digital advertising.",
                "requirements": "3+ years digital marketing experience, Google Analytics certified",
                "salary_range": "KES 120,000 - 180,000",
                "deadline": timezone.now().date() + timedelta(days=25),
                "is_featured": False
            },
            {
                "title": "Financial Analyst",
                "company": "KCB Bank",
                "location": "Nairobi, Kenya",
                "job_type": Job.TYPE_FULL_TIME,
                "description": "Analyze financial data, prepare reports, and support investment decisions.",
                "requirements": "CPA/ACCA, 2+ years experience in financial analysis",
                "salary_range": "KES 150,000 - 200,000",
                "deadline": timezone.now().date() + timedelta(days=30),
                "is_featured": True
            },
            {
                "title": "Registered Nurse",
                "company": "Aga Khan Hospital",
                "location": "Mombasa, Kenya",
                "job_type": Job.TYPE_FULL_TIME,
                "description": "Provide quality patient care in a fast-paced hospital environment.",
                "requirements": "BSc Nursing, registered with Nursing Council of Kenya",
                "salary_range": "KES 80,000 - 120,000",
                "deadline": timezone.now().date() + timedelta(days=15),
                "is_featured": False
            },
            {
                "title": "Web Developer Intern",
                "company": "Andela Kenya",
                "location": "Nairobi, Kenya",
                "job_type": Job.TYPE_INTERNSHIP,
                "description": "Learn and grow as a full-stack developer with mentorship.",
                "requirements": "Basic knowledge of HTML, CSS, JavaScript, willingness to learn",
                "salary_range": "KES 30,000 - 50,000",
                "deadline": timezone.now().date() + timedelta(days=10),
                "is_featured": False
            },
            {
                "title": "Customer Service Representative",
                "company": "Telkom Kenya",
                "location": "Nairobi, Kenya",
                "job_type": Job.TYPE_FULL_TIME,
                "description": "Handle customer inquiries, complaints, and provide support.",
                "requirements": "Excellent communication skills, 1+ year customer service experience",
                "salary_range": "KES 50,000 - 70,000",
                "deadline": timezone.now().date() + timedelta(days=18),
                "is_featured": False
            },
            {
                "title": "Project Manager - Construction",
                "company": "China Wu Yi",
                "location": "Nakuru, Kenya",
                "job_type": Job.TYPE_CONTRACT,
                "description": "Oversee construction projects from planning to completion.",
                "requirements": "Civil Engineering degree, 7+ years experience, PMP certification",
                "salary_range": "KES 300,000 - 450,000",
                "deadline": timezone.now().date() + timedelta(days=35),
                "is_featured": True
            },
            {
                "title": "Part-time Graphic Designer",
                "company": "Creative Agency KE",
                "location": "Remote",
                "job_type": Job.TYPE_PART_TIME,
                "description": "Create visual content for social media and marketing materials.",
                "requirements": "Proficient in Adobe Suite, portfolio required",
                "salary_range": "KES 40,000 - 60,000",
                "deadline": timezone.now().date() + timedelta(days=12),
                "is_featured": False
            },
        ]
        
        jobs = []
        for i, data in enumerate(jobs_data):
            category = categories[i % len(categories)]
            slug = slugify(f"{data['title']} {data['company']}")
            
            job, created = Job.objects.get_or_create(
                slug=slug,
                defaults={
                    "title": data["title"],
                    "company": data["company"],
                    "category": category,
                    "location": data["location"],
                    "job_type": data["job_type"],
                    "description": data["description"],
                    "requirements": data["requirements"],
                    "salary_range": data["salary_range"],
                    "deadline": data["deadline"],
                    "is_featured": data["is_featured"],
                    "is_active": True,
                    "posted_by": random.choice(users["staff"] + [users["admin"]])
                }
            )
            jobs.append(job)
            if created:
                self.stdout.write(f"  ✓ Created job: {job.title} at {job.company}")
        
        return jobs
    
    def create_job_applications(self, users, jobs):
        """Create job applications from students."""
        statuses = ["pending", "reviewing", "shortlisted", "rejected", "hired"]
        
        for student in users["students"][:7]:
            # Apply to 1-3 jobs
            num_applications = random.randint(1, 3)
            selected_jobs = random.sample(jobs, min(num_applications, len(jobs)))
            
            for job in selected_jobs:
                # Skip if already applied
                if JobApplication.objects.filter(user=student, job=job).exists():
                    continue
                
                status = random.choice(statuses)
                
                application = JobApplication.objects.create(
                    user=student,
                    job=job,
                    cover_letter=f"Dear hiring team at {job.company},\n\nI am writing to express my strong interest in the {job.title} position. With my background in {random.choice(['technology', 'business', 'healthcare', 'education'])} and passion for excellence, I believe I would be a great fit for your team.\n\nThank you for considering my application.\n\nSincerely,\n{student.first_name} {student.last_name}",
                    status=status,
                    admin_notes=random.choice(["", "Good candidate", "Schedule interview", "Needs more experience"]) if status != "pending" else ""
                )
                
                # Create document
                JobApplicationDocument.objects.create(
                    application=application,
                    doc_type="cv",
                    file=f"cvs/{student.username}_cv.pdf"
                )
                
                self.stdout.write(f"  ✓ Student {student.username} applied to {job.title} - Status: {status}")
    
    def create_contact_enquiries(self):
        """Create contact form enquiries."""
        enquiries_data = [
            {"name": "John Doe", "email": "john@example.com", "subject": "Scholarship Application Help", "message": "I need help applying for the Canadian scholarship. Can you assist?"},
            {"name": "Jane Smith", "email": "jane@example.com", "subject": "Visa Assistance", "message": "Do you provide visa processing services for all countries?"},
            {"name": "Michael Brown", "email": "michael@example.com", "subject": "Partnership Inquiry", "message": "Our organization would like to partner with NovaWings."},
            {"name": "Sarah Wilson", "email": "sarah@example.com", "subject": "Job Posting", "message": "How can I post a job on your platform?"},
        ]
        
        for data in enquiries_data:
            enquiry = ContactEnquiry.objects.create(
                name=data["name"],
                email=data["email"],
                phone=f"+2547{random.randint(10000000, 99999999)}",
                subject=data["subject"],
                message=data["message"],
                is_replied=random.choice([True, False])
            )
            self.stdout.write(f"  ✓ Created enquiry from {enquiry.name}")
    
    def create_notifications(self, users):
        """Create notifications for users."""
        notification_templates = [
            {"title": "Scholarship Application Received", "message": "Your scholarship application has been received and is under review.", "link": "/dashboard/applications"},
            {"title": "Document Verification", "message": "Your uploaded documents have been verified successfully.", "link": "/dashboard/documents"},
            {"title": "New Job Matched", "message": "We found a new job that matches your profile!", "link": "/jobs"},
            {"title": "Payment Successful", "message": "Your payment was processed successfully. You can now access the scholarship details.", "link": "/dashboard/unlocks"},
            {"title": "Application Status Update", "message": "Your scholarship application has been moved to the next stage.", "link": "/dashboard/applications"},
        ]
        
        for user in users["students"]:
            # Create 2-3 notifications per student
            num_notifications = random.randint(2, 4)
            selected_templates = random.sample(notification_templates, min(num_notifications, len(notification_templates)))
            
            for template in selected_templates:
                Notification.objects.create(
                    user=user,
                    title=template["title"],
                    message=template["message"],
                    is_read=random.choice([True, False]),
                    link=template["link"]
                )
            
            self.stdout.write(f"  ✓ Created notifications for {user.first_name} {user.last_name}")


import uuid