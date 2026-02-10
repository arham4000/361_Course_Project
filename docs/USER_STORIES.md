# User Stories

This document lists user stories with their acceptance criteria and non-functional requirements. Implementation should satisfy these when building the corresponding features.

---

## User Story 1: Create a Job Seeker Profile

**Description:** As a job seeker, I want to create a profile with my skills, experience, and preferences so I can be matched to open roles.

### Acceptance criteria (back of card)

#### Functional requirements

- **Given** a job seeker is on the profile creation page, **when** they enter all required information and click on "submit", **then** the application will store the candidate profile in the database.

#### Quality attributes & non-functional requirements

- **Simplicity:** The profile creation page should only request essential information to build the profile.
- **Simplicity:** The profile creation page will have only **10 input fields** to generate a profile, and **two file upload fields** for attaching a resume and cover letter, all on a single page.

### Implementation notes

- The job seeker profile form (frontend) and `POST /api/profiles` (backend) must support exactly 10 input fields plus 2 file uploads (resume, cover letter). Field names and types should be chosen to support matching (e.g. skills, experience) and display; store file references or file data per project decisions (see [ARCHITECTURE.md](ARCHITECTURE.md) and [IMPLEMENTATION_PLAN.md](IMPLEMENTATION_PLAN.md)).

---

## User Story 3: See Relevant Openings

**Description:** As a job seeker, I want to view a list of jobs matched to my profile so that I can review available opportunities.

### Acceptance criteria (back of card)

#### Functional requirements

- **Given** the user/recruiter has completed their profile/listing, **when** they are on the match viewing page, **then** the system will display profile/listing matches.

#### Quality attributes & non-functional requirements

- **Simplicity:** Only matches should be shown, no other distracting information or visuals.
- **Simplicity:** The matches page should display only matched listings and their details (**job title, company, location, match score**) and should not include advertisements, notifications, or visuals other than site navigation and matched listings.
- **Relevance:** Only listings/profiles should be shown that matched based on some threshold, such as an **80% match**.
- **Relevance:** Only listings/profiles should be shown that matched based on the system matching algorithm.
- **Transparency:** The criteria used for the match should be shown.

### Implementation notes

- Applies to both **job seeker match view** (matched job listings) and **recruiter match view** (matched candidate profiles). The match viewing page must show only results returned by the matching service; no ads, notifications, or extraneous visuals—only site navigation and the match list.
- **Job seeker view:** For each matched listing, display at least job title, company, location, and match score. **Recruiter view:** For each matched profile, display equivalent key details and match score.
- **Threshold:** Only show matches that meet a relevance threshold (e.g. **80% match**). The matching service should return a score per match; the API or frontend filters/display should enforce the threshold (e.g. only show when score ≥ 80% or equivalent).
- **Transparency:** Display the criteria used for the match (e.g. skills, experience level, location alignment). This may come from the matching service response (e.g. criteria or factors that contributed to the score) or from the stored job/profile criteria; the UI should surface it so users understand why a listing/profile was matched (see [SPRINT_1.md](SPRINT_1.md) for match contract and [User Story 8](USER_STORIES.md#user-story-8-create-a-job-listing) for listing criteria).

---

## User Story 8: Create a Job Listing

**Description:** As a recruiter/employer, I want to create a job listing with role requirements so that candidates can be matched to it.

### Acceptance criteria (back of card)

#### Functional requirements

- **Given** a recruiter/employer is on the job listing creation page, **when** they enter all required information and click on "submit", **then** the application will store the job listing information in the database.

#### Quality attributes & non-functional requirements

- **Simplicity:** The job listing creation page should only require essential information to create the listing.
- **Simplicity:** The job listing creation page will have only **10 or fewer input fields** to define a job listing on a single page.
- **Transparency:** The job listing must include all criteria used to determine matches.
- **Transparency:** Each job listing should display the specific matching criteria used, including required skills, experience level, location, and the recruiter must select applicable criteria before the listing can be submitted.

### Implementation notes

- The job listing form (frontend) and `POST /api/jobs` (backend) must support at most 10 input fields on a single page. Matching criteria (required skills, experience level, location, and any other criteria used by the matching service) must be explicit: the form must include these as selectable/enterable fields, they must be stored with the listing, and the listing view must display them. Submission should be allowed only when the recruiter has selected or entered the applicable matching criteria so that matches are determined transparently (see [ARCHITECTURE.md](ARCHITECTURE.md) and [SPRINT_1.md](SPRINT_1.md) for match contract).
