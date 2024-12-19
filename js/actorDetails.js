document.addEventListener('DOMContentLoaded', () => {
    const headers = document.querySelectorAll('.accordion-header');
    const overlay = document.getElementById('overlay');
    const loadingSpinner = document.getElementById('loading-spinner');
  
    // Fetch the data when the page loads
    const urlParams = new URLSearchParams(window.location.search);
    const personId = urlParams.get('people');
    const name = urlParams.get('name');
  
    if (!personId || !name) {
      window.location.href = './index.html';
      return;
    }
  
    // API base URL
    const apiBase = 'https://bollygradmovies.com/api/';
  
    // Utility function to fetch data
    const fetchData = async (endpoint) => {
      try {
        const response = await fetch(`${apiBase}${endpoint}`);
        return response.ok ? response.json() : null;
      } catch (error) {
        console.error(`Error fetching ${endpoint}:`, error);
        return null;
      }
    };
  
    // Populate sections with dynamic content
    const populateSection = (selector, content) => {
      const section = document.querySelector(selector);
      if (content) {
        section.innerHTML = content;
        section.style.display = 'block';
      } else {
        section.style.display = 'none';
      }
    };
  
    // Format date function for consistency
    const formatDate = (dateStr) => {
      if (!dateStr || dateStr === '0000-00-00') return 'N/A';
      return new Date(dateStr).toLocaleDateString('en-IN', {
        day: 'numeric', month: 'long', year: 'numeric',
      });
    };
  
    // Toggle accordion sections
    headers.forEach(header => {
      header.addEventListener('click', () => {
        const content = header.nextElementSibling;
        content.style.display = content.style.display === 'block' ? 'none' : 'block';
      });
    });
  
    // Load the content dynamically
    const loadContent = async () => {
      overlay.style.display = 'block';  // Show the loader
  
      // Fetch all required data
      const [castAndCrew, intro, biography, childhood, backstory] = await Promise.all([
        fetchData(`cast_and_crew/${personId}`),
        fetchData(`cc_intro/0/${personId}`),
        fetchData(`biography/0/${personId}`),
        fetchData(`cc_childhood/0/${personId}`),
        fetchData(`cc_back_stories/0/${personId}`)
      ]);
  
      // Hide the loader once data is loaded
      overlay.style.display = 'none';
  
      // Populate Name and Photo Section
      if (castAndCrew) {
        document.title = `${castAndCrew.name} | Bollygrad Movies`;
        populateSection('.name-photo-section', `
          <h1>${castAndCrew.name}</h1>
          <img src="${castAndCrew.picture || 'default-photo.jpg'}" alt="${castAndCrew.name}'s Photo" class="person-photo" />
          <p><strong>Date of Birth:</strong> ${formatDate(castAndCrew.dob)}</p>
          <p><strong>Wikipedia:</strong> <a href="${castAndCrew.wiki_link}" target="_blank">Link</a></p>
        `);
      }
  
      // Populate sections like Introduction, Biography, Childhood, Backstory, etc.
      populateSection('.intro-section', intro?.map(item => `<p>${item.intro}</p>`).join('') || 'No introduction available.');
      populateSection('.biography-section', biography?.map(item => item.biography).join('') || 'No biography available.');
      populateSection('.childhood-section', childhood?.map(item => `<p>${item.story}</p>`).join('') || 'No childhood info available.');
      populateSection('.backstory-section', backstory?.map(item => `<p>${item.story}</p>`).join('') || 'No backstory available.');
    };
  
    loadContent();
  });
  