-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable Row Level Security
ALTER DATABASE postgres SET row_security = on;

-- Create enum for procedure types
CREATE TYPE procedure_type AS ENUM ('Neurotoxin', 'Dermal Filler');

-- Create procedures table
CREATE TABLE procedures (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    area TEXT NOT NULL,
    type procedure_type NOT NULL,
    description TEXT,
    slug TEXT UNIQUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create injection_patterns table
CREATE TABLE injection_patterns (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    procedure_id UUID REFERENCES procedures(id) ON DELETE CASCADE,
    pattern_name TEXT NOT NULL,
    target_muscles JSONB,
    dosages JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create complications table
CREATE TABLE complications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    signs_symptoms TEXT[],
    management_protocol JSONB,
    associated_procedures UUID[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create checklist_records table
CREATE TABLE checklist_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    procedure_name TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    pdf_url TEXT
);

-- Enable RLS on all tables
ALTER TABLE procedures ENABLE ROW LEVEL SECURITY;
ALTER TABLE injection_patterns ENABLE ROW LEVEL SECURITY;
ALTER TABLE complications ENABLE ROW LEVEL SECURITY;
ALTER TABLE checklist_records ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Procedures: Public read access
CREATE POLICY "Public read access for procedures" ON procedures
    FOR SELECT USING (true);

-- Injection patterns: Public read access
CREATE POLICY "Public read access for injection_patterns" ON injection_patterns
    FOR SELECT USING (true);

-- Complications: Public read access
CREATE POLICY "Public read access for complications" ON complications
    FOR SELECT USING (true);

-- Checklist records: Users can only see their own records
CREATE POLICY "Users can view own checklist records" ON checklist_records
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own checklist records" ON checklist_records
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Seed data for procedures
INSERT INTO procedures (name, area, type, description, slug) VALUES
('Forehead Lines Treatment', 'Forehead', 'Neurotoxin', 'Treatment of horizontal forehead lines using botulinum toxin injections targeting the frontalis muscle.', 'forehead-lines'),
('Glabellar Lines Treatment', 'Glabella', 'Neurotoxin', 'Treatment of vertical frown lines between the eyebrows targeting the corrugator and procerus muscles.', 'glabellar-lines'),
('Crow''s Feet Treatment', 'Periorbital', 'Neurotoxin', 'Treatment of lateral canthal lines targeting the orbicularis oculi muscle.', 'crows-feet'),
('Nasolabial Fold Enhancement', 'Mid-face', 'Dermal Filler', 'Enhancement of nasolabial folds using hyaluronic acid dermal fillers.', 'nasolabial-folds'),
('Lip Enhancement', 'Lips', 'Dermal Filler', 'Lip volume enhancement and contouring using hyaluronic acid fillers.', 'lip-enhancement');

-- Seed data for injection patterns
INSERT INTO injection_patterns (procedure_id, pattern_name, target_muscles, dosages) VALUES
(
    (SELECT id FROM procedures WHERE slug = 'forehead-lines'),
    'Standard Forehead Pattern',
    '["frontalis"]',
    '[
        {"site_name": "Central forehead", "dosage_range": "4-6 units", "depth": "Intramuscular", "notes": "Avoid over-treatment to prevent brow ptosis"},
        {"site_name": "Lateral forehead", "dosage_range": "2-4 units per side", "depth": "Intramuscular", "notes": "Maintain natural brow arch"}
    ]'
),
(
    (SELECT id FROM procedures WHERE slug = 'glabellar-lines'),
    'Standard Glabellar Pattern',
    '["corrugator supercilii", "procerus", "depressor supercilii"]',
    '[
        {"site_name": "Procerus", "dosage_range": "4-6 units", "depth": "Intramuscular", "notes": "Single injection point"},
        {"site_name": "Corrugator (medial)", "dosage_range": "4-6 units per side", "depth": "Intramuscular", "notes": "Avoid medial injection to prevent ptosis"},
        {"site_name": "Corrugator (lateral)", "dosage_range": "2-4 units per side", "depth": "Intramuscular", "notes": "Target lateral fibers"}
    ]'
);

-- Seed data for complications
INSERT INTO complications (name, signs_symptoms, management_protocol) VALUES
(
    'Eyelid Ptosis',
    ARRAY['Drooping of upper eyelid', 'Asymmetrical eye appearance', 'Difficulty opening affected eye', 'Patient reports heavy feeling in eyelid'],
    '{
        "immediate_steps": [
            "Reassure patient that condition is temporary",
            "Document onset time and severity",
            "Take photographs for medical record"
        ],
        "treatment_options": [
            "Prescribe apraclonidine 0.5% eye drops (off-label use)",
            "Instruct patient to apply drops 2-3 times daily",
            "Consider iopidine 0.5% as alternative"
        ],
        "follow_up": [
            "Schedule follow-up in 1-2 weeks",
            "Monitor progression and recovery",
            "Expected resolution in 2-8 weeks"
        ],
        "prevention": [
            "Avoid injection too close to orbital rim",
            "Use appropriate injection depth",
            "Consider lower dosages in high-risk patients"
        ]
    }'
),
(
    'Vascular Occlusion',
    ARRAY['Immediate blanching of skin', 'Severe pain at injection site', 'Skin color changes (white, then blue/purple)', 'Cool skin temperature', 'Delayed capillary refill'],
    '{
        "immediate_steps": [
            "STOP injection immediately",
            "Apply warm compress to area",
            "Massage injection site vigorously",
            "Administer hyaluronidase if HA filler used"
        ],
        "emergency_treatment": [
            "Inject hyaluronidase 150-300 units around affected area",
            "Apply nitroglycerin paste 2% if available",
            "Consider aspirin 325mg if no contraindications",
            "Refer to emergency department if severe"
        ],
        "monitoring": [
            "Assess for signs of tissue necrosis",
            "Document with serial photography",
            "Monitor for 24-48 hours minimum"
        ],
        "follow_up": [
            "Daily assessment until resolved",
            "Consider hyperbaric oxygen therapy for severe cases",
            "Plastic surgery consultation if tissue loss occurs"
        ]
    }'
);
