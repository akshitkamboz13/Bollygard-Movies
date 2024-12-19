function owl() {
    $('.owl-carousel').owlCarousel({
        stagePadding: 10,  // Reduced padding for smoother transition
        loop: false,
        margin: 15,        // Reduced margin between items
        autoplay: true,    // Enable auto play
        autoplayTimeout: 3000, // 3 seconds timeout between slides
        autoplayHoverPause: true, // Pause autoplay on hover
        nav: true,         // Show navigation arrows
        dots: true,       // Disable dots
        // navText: ['<', '>'], // Custom navigation arrows
        mouseDrag: true,   // Enable mouse drag scrolling
        touchDrag: true,   // Enable touch drag for mobile
        responsiveClass: true,
        responsive: {
            0: {
                items: 1,
                nav: true,   // Show arrows on mobile
                dots: true,  // Dots for mobile
                stagePadding: 20, // Padding for mobile view
            },
            600: {
                items: 2,
                nav: true,   // Show arrows on small screens
                dots: false, // Hide dots on small screens
                stagePadding: 20, // Padding for tablets
            },
            1000: {
                items: 4,
                nav: true,
                dots: false,  // Hide dots for larger screens
                stagePadding: 30, // Padding for large screens
            },
            1900: {
                items: 6,
                nav: true,
                dots: false,  // Hide dots for larger screens
                stagePadding: 50, // More padding for very large screens
            }
        },
        onInitialized: function() {
            // Optional: Apply custom animation or styles when carousel is initialized
            $('.owl-carousel .owl-item').css('transition', 'transform 0.5s ease-in-out');
        }
    });
};
