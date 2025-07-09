import { initializeAdmin, setupEventListeners } from './dashboard.js';
import { setupUserEvents } from './users.js';
import { setupProductEvents } from './products.js';
import { setupOrderEvents } from './orders.js';

document.addEventListener('DOMContentLoaded', () => {
     showSection('dashboard');
    initializeAdmin();
    setupEventListeners();
    setupUserEvents();
    setupProductEvents();
    setupOrderEvents();
});
export function showSection(sectionId) {
  const sections = document.querySelectorAll('.section');
  sections.forEach(section => {
    section.style.display = 'none';
    section.classList.remove('active');
  });

  const target = document.getElementById(sectionId);
  if (target) {
    target.style.display = 'block';
    target.classList.add('active');

    // Cập nhật tiêu đề trang
    const pageTitle = document.getElementById('page-title');
    if (pageTitle) {
      pageTitle.textContent = target.querySelector('h2')?.textContent || 'Trang';
    }
  }
}
window.showSection = showSection;