-- Test Data Seeds for Task Management API
-- Description: Sample data for development and testing
-- Version: 001
-- Date: 2025-08-12

-- Note: Passwords are hashed versions of 'password123' for testing
-- In production, these would be generated through the application's registration process

-- Insert test users
INSERT INTO users (email, password_hash, first_name, last_name) VALUES
  ('john.doe@example.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj9QJtYvJg2G', 'John', 'Doe'),
  ('jane.smith@example.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj9QJtYvJg2G', 'Jane', 'Smith'),
  ('bob.wilson@example.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj9QJtYvJg2G', 'Bob', 'Wilson')
ON CONFLICT (email) DO NOTHING;

-- Insert test tasks for John Doe (user_id = 1)
INSERT INTO tasks (user_id, title, description, priority, status, due_date) VALUES
  (1, 'Complete project documentation', 'Write comprehensive API documentation for the task management system', 'high', 'pending', '2025-08-15 23:59:59'),
  (1, 'Review code changes', 'Review pull requests from team members', 'medium', 'in-progress', '2025-08-13 17:00:00'),
  (1, 'Update dependencies', 'Update npm packages to latest versions', 'low', 'pending', '2025-08-20 12:00:00'),
  (1, 'Fix authentication bug', 'Resolve issue with JWT token expiration', 'high', 'completed', '2025-08-10 15:30:00');

-- Insert test tasks for Jane Smith (user_id = 2)
INSERT INTO tasks (user_id, title, description, priority, status, due_date) VALUES
  (2, 'Design new UI components', 'Create reusable React components for the dashboard', 'medium', 'in-progress', '2025-08-16 10:00:00'),
  (2, 'Database optimization', 'Optimize slow queries and add proper indexes', 'high', 'pending', '2025-08-14 14:00:00'),
  (2, 'Write unit tests', 'Add test coverage for new features', 'medium', 'pending', '2025-08-18 16:00:00');

-- Insert test tasks for Bob Wilson (user_id = 3)
INSERT INTO tasks (user_id, title, description, priority, status, due_date) VALUES
  (3, 'Security audit', 'Perform comprehensive security review of the application', 'high', 'pending', '2025-08-17 09:00:00'),
  (3, 'Performance testing', 'Load test the API endpoints', 'medium', 'completed', '2025-08-11 11:30:00'),
  (3, 'Setup monitoring', 'Configure application monitoring and alerting', 'low', 'in-progress', '2025-08-19 13:00:00');

-- Verify data insertion
-- SELECT 
--   u.email, 
--   COUNT(t.id) as task_count,
--   COUNT(CASE WHEN t.status = 'pending' THEN 1 END) as pending_tasks,
--   COUNT(CASE WHEN t.status = 'in-progress' THEN 1 END) as in_progress_tasks,
--   COUNT(CASE WHEN t.status = 'completed' THEN 1 END) as completed_tasks
-- FROM users u
-- LEFT JOIN tasks t ON u.id = t.user_id
-- GROUP BY u.id, u.email
-- ORDER BY u.id;
