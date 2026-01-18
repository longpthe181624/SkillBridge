-- SkillBridge Database - Insert Sample Engineers
-- Flyway Migration V3: Insert sample engineer profiles for testing and demo

-- Insert Sample Engineers (9 engineers: 3 per category)
INSERT INTO engineers (full_name, years_experience, seniority, summary, location, language_summary, status, profile_image_url, salary_expectation, primary_skill) VALUES
-- Web Development Engineers (3)
('Nguyen Van A', 6, 'Senior', 'Experienced full-stack developer with expertise in React and Node.js. Passionate about building scalable web applications and mentoring junior developers.', 'Vietnam', 'English (Fluent), Japanese (Basic)', 'AVAILABLE', '/images/engineers/nguyen-van-a.jpg', 350000, 'React'),
('Pham Thi D', 4, 'Mid', 'Frontend developer specializing in Vue.js and TypeScript. Strong focus on user experience and performance optimization.', 'Vietnam', 'English (Intermediate)', 'AVAILABLE', '/images/engineers/pham-thi-d.jpg', 300000, 'Vue.js'),
('Hoang Van E', 7, 'Senior', 'Backend developer with expertise in Java and Spring Boot. Experienced in microservices architecture and cloud deployment.', 'Vietnam', 'English (Fluent)', 'AVAILABLE', '/images/engineers/hoang-van-e.jpg', 450000, 'Backend Development'),

-- Game Development Engineers (3)
('Tran Thi B', 5, 'Mid', 'Game developer specializing in Unity and C#. Experience in mobile and console game development with focus on gameplay mechanics.', 'Vietnam', 'English (Intermediate)', 'AVAILABLE', '/images/engineers/tran-thi-b.jpg', 400000, 'Unity'),
('Do Van G', 6, 'Senior', 'Unreal Engine expert with 6 years of AAA game development experience. Specialized in graphics programming and optimization.', 'Vietnam', 'English (Fluent)', 'AVAILABLE', '/images/engineers/do-van-g.jpg', 480000, 'Unreal Engine'),
('Nguyen Thi H', 4, 'Mid', 'Mobile game developer with Unity and Godot experience. Focus on casual games and user engagement mechanics.', 'Vietnam', 'English (Intermediate)', 'AVAILABLE', '/images/engineers/nguyen-thi-h.jpg', 360000, 'Unity'),

-- AI/ML Development Engineers (3)
('Le Van C', 8, 'Senior', 'AI/ML engineer with expertise in Python and TensorFlow. Experience in computer vision and natural language processing projects.', 'Vietnam', 'English (Fluent)', 'AVAILABLE', '/images/engineers/le-van-c.jpg', 500000, 'Machine Learning'),
('Tran Van I', 5, 'Mid', 'Deep Learning specialist with expertise in PyTorch and Computer Vision. Research background in neural network optimization.', 'Vietnam', 'English (Fluent)', 'AVAILABLE', '/images/engineers/tran-van-i.jpg', 450000, 'Deep Learning'),
('Bui Thi J', 6, 'Senior', 'Data Science and AI engineer with NLP expertise. Experience in building production-ready ML models and data pipelines.', 'Vietnam', 'English (Fluent)', 'AVAILABLE', '/images/engineers/bui-thi-j.jpg', 520000, 'Artificial Intelligence');

-- Insert Engineer Skills (linking engineers to their skills)
INSERT INTO engineer_skills (engineer_id, skill_id, level, years) VALUES
-- Web Development Engineers
(1, 4, 'Advanced', 4),     -- Nguyen Van A - React
(1, 7, 'Advanced', 3),     -- Nguyen Van A - Node.js
(2, 5, 'Advanced', 3),     -- Pham Thi D - Vue.js
(3, 8, 'Expert', 5),       -- Hoang Van E - Java
(3, 10, 'Expert', 5),      -- Hoang Van E - Spring Boot

-- Game Development Engineers
(4, 12, 'Advanced', 3),    -- Tran Thi B - Unity
(4, 15, 'Advanced', 4),    -- Tran Thi B - C#
(5, 13, 'Expert', 4),      -- Do Van G - Unreal Engine
(5, 16, 'Expert', 5),      -- Do Van G - C++
(6, 12, 'Advanced', 3),    -- Nguyen Thi H - Unity
(6, 14, 'Intermediate', 2), -- Nguyen Thi H - Godot

-- AI/ML Engineers
(7, 18, 'Expert', 5),      -- Le Van C - Machine Learning
(7, 21, 'Advanced', 4),    -- Le Van C - TensorFlow
(8, 19, 'Advanced', 4),    -- Tran Van I - Deep Learning
(8, 22, 'Expert', 4),      -- Tran Van I - PyTorch
(8, 24, 'Advanced', 3),    -- Tran Van I - Computer Vision
(9, 18, 'Expert', 5),      -- Bui Thi J - Machine Learning
(9, 23, 'Expert', 4);      -- Bui Thi J - Natural Language Processing

-- Insert Sample Contacts (for customer statistics)
INSERT INTO contacts (client_user_id, status) VALUES
(1, 'ACTIVE'),
(2, 'ACTIVE'),
(3, 'ACTIVE');

