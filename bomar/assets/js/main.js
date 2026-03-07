(function($) {

	var $window = $(window),
		$body = $('body'),
		$wrapper = $('#page-wrapper'),
		$banner = $('#banner'),
		$header = $('#header');

	// Breakpoints.
	breakpoints({
		xlarge:  [ '1281px', '1680px' ],
		large:   [ '981px',  '1280px' ],
		medium:  [ '737px',  '980px'  ],
		small:   [ '481px',  '736px'  ],
		xsmall:  [ null,     '480px'  ]
	});

	// Play initial animations on page load.
	$window.on('load', function() {
		window.setTimeout(function() {
			$body.removeClass('is-preload');
		}, 100);
	});

	// Mobile?
	if (browser.mobile)
		$body.addClass('is-mobile');
	else {
		breakpoints.on('>medium', function() {
			$body.removeClass('is-mobile');
		});
		breakpoints.on('<=medium', function() {
			$body.addClass('is-mobile');
		});
	}

	// Scrolly.
	$('.scrolly').scrolly({
		speed: 1500,
		offset: $header.outerHeight()
	});

	// Menu.
	$('#menu')
		.append('<a href="#menu" class="close"></a>')
		.appendTo($body)
		.panel({
			delay: 500,
			hideOnClick: true,
			hideOnSwipe: true,
			resetScroll: true,
			resetForms: true,
			side: 'right',
			target: $body,
			visibleClass: 'is-menu-visible'
		});

	// Header.
	if ($banner.length > 0 && $header.hasClass('alt')) {
		$window.on('resize', function() { $window.trigger('scroll'); });
		$banner.scrollex({
			bottom: $header.outerHeight() + 1,
			terminate: function() { $header.removeClass('alt'); },
			enter: function() { $header.addClass('alt'); },
			leave: function() { $header.removeClass('alt'); }
		});
	}

	// Scroll-triggered animations (Intersection Observer).
	if ('IntersectionObserver' in window) {
		var observer = new IntersectionObserver(function(entries) {
			entries.forEach(function(entry) {
				if (entry.isIntersecting) {
					entry.target.classList.add('is-visible');
					observer.unobserve(entry.target);
				}
			});
		}, {
			threshold: 0.1,
			rootMargin: '0px 0px -50px 0px'
		});

		document.querySelectorAll('.animate-on-scroll').forEach(function(el) {
			observer.observe(el);
		});
	} else {
		document.querySelectorAll('.animate-on-scroll').forEach(function(el) {
			el.classList.add('is-visible');
		});
	}

	// Scroll progress indicator.
	var $progressBar = $('<div class="scroll-indicator"></div>');
	$body.append($progressBar);

	$window.on('scroll', function() {
		var scrollTop = $window.scrollTop();
		var docHeight = $(document).height() - $window.height();
		var scrollPercent = (scrollTop / docHeight) * 100;
		$progressBar.css('width', scrollPercent + '%');
	});

	// Smooth reveal for stats numbers (count-up effect).
	if ('IntersectionObserver' in window) {
		var statsObserver = new IntersectionObserver(function(entries) {
			entries.forEach(function(entry) {
				if (entry.isIntersecting) {
					var $el = $(entry.target);
					var text = $el.text();
					var match = text.match(/^([\d,.]+)/);

					if (match) {
						var targetNum = parseInt(match[1].replace(/[,]/g, ''), 10);
						var suffix = text.replace(match[1], '');
						var duration = 2000;
						var startTime = null;

						function animate(timestamp) {
							if (!startTime) startTime = timestamp;
							var progress = Math.min((timestamp - startTime) / duration, 1);
							var eased = 1 - Math.pow(1 - progress, 3);
							var current = Math.floor(eased * targetNum);

							if (targetNum >= 1000000) {
								$el.text(Math.floor(current / 1000000) + 'M' + suffix.replace(/[KM]/, ''));
							} else if (targetNum >= 1000) {
								$el.text(Math.floor(current / 1000) + 'K' + suffix.replace(/[KM]/, ''));
							} else {
								$el.text(current + suffix);
							}

							if (progress < 1) {
								requestAnimationFrame(animate);
							} else {
								$el.text(text);
							}
						}
						requestAnimationFrame(animate);
					}
					statsObserver.unobserve(entry.target);
				}
			});
		}, { threshold: 0.5 });

		document.querySelectorAll('.stat-number').forEach(function(el) {
			statsObserver.observe(el);
		});
	}

})(jQuery);
