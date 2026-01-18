-- SkillBridge Database - Insert Skills
-- Flyway Migration V2: Insert initial skills data

-- Insert parent skills and sub-skills
INSERT INTO skills (name, parent_skill_id) VALUES
-- Web Development Skills
('Web Development', NULL),
('Frontend Development', 1),
('Backend Development', 1),
('React', 2),
('Vue.js', 2),
('Angular', 2),
('Node.js', 3),
('Java', 3),
('Python', 3),
('Spring Boot', 8),

-- Game Development Skills
('Game Development', NULL),
('Unity', 11),
('Unreal Engine', 11),
('Godot', 11),
('C#', 11),
('C++', 11),

-- AI/ML Development Skills
('AI/ML Development', NULL),
('Machine Learning', 17),
('Deep Learning', 17),
('Data Science', 17),
('TensorFlow', 18),
('PyTorch', 19),
('Natural Language Processing', 17),
('Computer Vision', 17);

