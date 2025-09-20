
(function($) {

	var	$window = $(window),
		$body = $('body'),
		$wrapper = $('#wrapper'),
		$header = $('#header'),
		$nav = $('#nav'),
		$main = $('#main'),
		$navPanelToggle, $navPanel, $navPanelInner;

	// Breakpoints.
		breakpoints({
			default:   ['1681px',   null       ],
			xlarge:    ['1281px',   '1680px'   ],
			large:     ['981px',    '1280px'   ],
			medium:    ['737px',    '980px'    ],
			small:     ['481px',    '736px'    ],
			xsmall:    ['361px',    '480px'    ],
			xxsmall:   [null,       '360px'    ]
		});

	jQuery.fn.extend({showModal: function() {
        return this.each(function() {
           if(this.tagName=== "DIALOG"){
                this.showModal();
            }
        });
 	}});

	jQuery.fn.extend({close: function() {
        return this.each(function() {
           if(this.tagName=== "DIALOG"){
                this.close();
            }
        });
 	}});

	/**
	 * Applies parallax scrolling to an element's background image.
	 * @return {jQuery} jQuery object.
	 */
	$.fn._parallax = function(intensity) {

		var	$window = $(window),
			$this = $(this);

		if (this.length == 0 || intensity === 0)
			return $this;

		if (this.length > 1) {

			for (var i=0; i < this.length; i++)
				$(this[i])._parallax(intensity);

			return $this;
		}

		if (!intensity)
			intensity = 0.25;

		$this.each(function() {
			var $t = $(this),
				$bg = $('<div class="bg"></div>').appendTo($t),
				on, off;
			on = function() {
				$bg
					.removeClass('fixed')
					.css('transform', 'matrix(1,0,0,1,0,0)');
				$window
					.on('scroll._parallax', function() {

						var pos = parseInt($window.scrollTop()) - parseInt($t.position().top);

						$bg.css('transform', 'matrix(1,0,0,1,0,' + (pos * intensity) + ')');

					});

			};

			off = function() {

				$bg
					.addClass('fixed')
					.css('transform', 'none');

				$window
					.off('scroll._parallax');

			};

			// Disable parallax on ..
				if (browser.name == 'ie'			// IE
				||	browser.name == 'edge'			// Edge
				||	window.devicePixelRatio > 1		// Retina/HiDPI (= poor performance)
				||	browser.mobile)					// Mobile devices
					off();

			// Enable everywhere else.
				else {

					breakpoints.on('>large', on);
					breakpoints.on('<=large', off);

				}

		});

		$window
			.off('load._parallax resize._parallax')
			.on('load._parallax resize._parallax', function() {
				$window.trigger('scroll');
			});

		return $(this);

	};

	// Play initial animations on page load.
		$window.on('load', function() {
			window.setTimeout(function() {
				$body.removeClass('is-preload');
			}, 100);
		});

	// Scrolly.
		$('.scrolly').scrolly();

	// Background.
		$wrapper._parallax(0.925);

	// Nav Panel.

		// Toggle.
			$navPanelToggle = $(
				'<a href="#navPanel" id="navPanelToggle">Menu</a>'
			)
				.appendTo($wrapper);

			// Change toggle styling once we've scrolled past the header.
				$header.scrollex({
					bottom: '5vh',
					enter: function() {
						$navPanelToggle.removeClass('alt');
					},
					leave: function() {
						$navPanelToggle.addClass('alt');
					}
				});

		const navContent =
			'<ul class="links">' +
				'<li data-page="index">' +
					'<a href="index.html">Employment</a>' +
				'</li>' +
				'<li data-page="about">' +
					'<a href="about.html">About</a>' +
				'</li>' +
				'<li data-page="qualifications">' +
					'<a href="qualifications.html">Qualifications</a>' +
				'</li>' +
			'</ul>' +
			'<ul class="icons" style="margin: 0;">' +
				'<li>' +
					'<a href="https://www.linkedin.com/in/robert-everett-989726269/" class="icon brands fa-linkedin">' +
					'<span class="label">LinkedIn</span></a>' +
				'</li>' +
				'<li>' +
					'<a href="https://github.com/robeverett" class="icon brands fa-github">' +
					'<span class="label">GitHub</span></a>' +
				'</li>' +
			'</ul>';

		// for large screens
		$navMenu = $('<nav id="nav">' + navContent + '</nav>').insertAfter($header); 

		// Panel.
			$navPanel = $(
				'<div id="navPanel">' +
					'<nav>' +
						navContent +		
					'</nav>' +
					'<a href="#navPanel" class="close"></a>' +
				'</div>'
			).appendTo($body)
				.panel({
					delay: 500,
					hideOnClick: true,
					hideOnSwipe: true,
					resetScroll: true,
					resetForms: true,
					side: 'right',
					target: $body,
					visibleClass: 'is-navPanel-visible'
				});

			// Get inner.
				$navPanelInner = $navPanel.children('nav');

			// Move nav content on breakpoint change.
				var $navContent = $nav.children();

				breakpoints.on('>medium', function() {

					// NavPanel -> Nav.
						$navContent.appendTo($nav);

					// Flip icon classes.
						$nav.find('.icons, .icon')
							.removeClass('alt');

				});

				breakpoints.on('<=medium', function() {

					// Nav -> NavPanel.
						$navContent.appendTo($navPanelInner);

					// Flip icon classes.
						$navPanelInner.find('.icons, .icon')
							.addClass('alt');

				});

			// Hack: Disable transitions on WP.
				if (browser.os == 'wp'
				&&	browser.osVersion < 10)
					$navPanel
						.css('transition', 'none');

	// Intro.
		var $intro = $('#intro');

		if ($intro.length > 0) {

			// Hack: Fix flex min-height on IE.
				if (browser.name == 'ie') {
					$window.on('resize.ie-intro-fix', function() {

						var h = $intro.height();

						if (h > $window.height())
							$intro.css('height', 'auto');
						else
							$intro.css('height', h);

					}).trigger('resize.ie-intro-fix');
				}

			// Hide intro on scroll (> small).
				breakpoints.on('>small', function() {

					$main.unscrollex();

					$main.scrollex({
						mode: 'bottom',
						top: '25vh',
						bottom: '-50vh',
						enter: function() {
							$intro.addClass('hidden');
						},
						leave: function() {
							$intro.removeClass('hidden');
						}
					});
				});

			// Hide intro on scroll (<= small).
				breakpoints.on('<=small', function() {

					$main.unscrollex();

					$main.scrollex({
						mode: 'middle',
						top: '15vh',
						bottom: '-15vh',
						enter: function() {
							$intro.addClass('hidden');
						},
						leave: function() {
							$intro.removeClass('hidden');
						}
					});
			});
		}
	
	// Use live date in pages
	const year = new Date().getFullYear();   // .toLocaleDateString("en-GB");
	const month = new Date().getMonth();
	
	$('#current-year').html(month + ' ' + year);

	const age = 3
console.log(`I'm ${age} years old!`)

		// carousel slider functions
		if (window.location.href.includes("qualifications")){

			const slidesContainer = document.getElementById("slides-container");
			const slide = document.querySelector(".slide");
			const prevButton = document.getElementById("slide-arrow-prev");
			const nextButton = document.getElementById("slide-arrow-next");

			nextButton.addEventListener("click", () => {

				const slideWidth = slide.clientWidth;		
				slidesContainer.scrollLeft += slideWidth;					
			});

			prevButton.addEventListener("click", () => {

				const slideWidth = slide.clientWidth;			
				slidesContainer.scrollLeft -= slideWidth;				
			});
		}

	window.addEventListener('load', () => {

		var page = window.location.href.substring(window.location.href.lastIndexOf('/') + 1);
		page = page.substring(0, page.indexOf('.'));

		// Find the navigation item with the matching data-page attribute and add the active class
		$('[data-page="' + page + '"]').addClass('active');
	});

	$('li a.large').bind('click', () => {
		$('#codeExamples').showModal();

		$('dialog button').bind('click', () => {
			$('#codeExamples').close();	
		});
	});


})(jQuery);
