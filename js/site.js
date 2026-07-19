/* Shared site behaviour: partials, nav, scroll reveal, counters.
   Every page loads this one file — no per-page duplication. */

(function () {
    'use strict';

    /* ---- Partials -------------------------------------------------------- */

    function inject(url, targetId) {
        var host = document.getElementById(targetId);
        if (!host) return Promise.resolve(false);

        return fetch(url)
            .then(function (res) {
                if (!res.ok) throw new Error('Failed to load ' + url);
                return res.text();
            })
            .then(function (html) {
                host.innerHTML = html;
                return true;
            })
            .catch(function (err) {
                console.error(err);
                return false;
            });
    }

    /* ---- Navigation ------------------------------------------------------ */

    function initNav() {
        var hamburger = document.querySelector('.hamburger');
        var menu = document.querySelector('.mobile-menu');
        var header = document.querySelector('.header-container');

        if (hamburger && menu) {
            var close = function () {
                hamburger.classList.remove('open');
                menu.classList.remove('open');
                document.body.style.overflow = '';
            };

            hamburger.addEventListener('click', function (e) {
                e.stopPropagation();
                var opening = !menu.classList.contains('open');
                hamburger.classList.toggle('open', opening);
                menu.classList.toggle('open', opening);
                document.body.style.overflow = opening ? 'hidden' : '';
            });

            document.addEventListener('click', function (e) {
                if (menu.classList.contains('open') &&
                    !menu.contains(e.target) && !hamburger.contains(e.target)) {
                    close();
                }
            });

            document.addEventListener('keydown', function (e) {
                if (e.key === 'Escape') close();
            });

            menu.querySelectorAll('a').forEach(function (link) {
                link.addEventListener('click', close);
            });
        }

        if (header) {
            var onScroll = function () {
                header.classList.toggle('scrolled', window.scrollY > 20);
            };
            window.addEventListener('scroll', onScroll, { passive: true });
            onScroll();
        }

        // Mark the current page. Compare file names so it works from any
        // directory depth and from "/" (which means index.html).
        var current = window.location.pathname.split('/').pop() || 'index.html';
        document.querySelectorAll('.nav-link').forEach(function (link) {
            var href = (link.getAttribute('href') || '').split('/').pop();
            if (href && href === current) link.classList.add('active');
        });
    }

    /* ---- Scroll reveal --------------------------------------------------- */

    function initReveal(root) {
        var items = (root || document).querySelectorAll('[data-reveal]:not(.is-visible)');
        if (!items.length) return;

        if (!('IntersectionObserver' in window)) {
            items.forEach(function (el) { el.classList.add('is-visible'); });
            return;
        }

        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) return;
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

        items.forEach(function (el) { observer.observe(el); });
    }

    /* Stagger children of any [data-stagger] container so grids and lists
       animate in sequence rather than all at once. */
    function applyStagger() {
        document.querySelectorAll('[data-stagger]').forEach(function (group) {
            var step = parseInt(group.getAttribute('data-stagger'), 10) || 90;
            var kids = group.querySelectorAll(':scope > [data-reveal]');
            kids.forEach(function (kid, i) {
                kid.style.setProperty('--d', (i * step) + 'ms');
            });
        });
    }

    /* ---- Counters -------------------------------------------------------- */

    function formatValue(value, decimals) {
        return value.toLocaleString('en-US', {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals
        });
    }

    function runCounter(el) {
        var target = parseFloat(el.getAttribute('data-target'));
        if (isNaN(target)) return;

        var decimals = parseInt(el.getAttribute('data-decimals'), 10) || 0;
        var duration = parseInt(el.getAttribute('data-duration'), 10) || 1800;
        var start = null;

        function frame(now) {
            if (start === null) start = now;
            var progress = Math.min((now - start) / duration, 1);
            // easeOutExpo — fast start, gentle settle
            var eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
            el.textContent = formatValue(target * eased, decimals);
            if (progress < 1) requestAnimationFrame(frame);
            else el.textContent = formatValue(target, decimals);
        }

        requestAnimationFrame(frame);
    }

    function initCounters() {
        var counters = document.querySelectorAll('.counter');
        if (!counters.length) return;

        if (!('IntersectionObserver' in window)) {
            counters.forEach(runCounter);
            return;
        }

        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) return;
                runCounter(entry.target);
                observer.unobserve(entry.target);
            });
        }, { threshold: 0.5 });

        counters.forEach(function (el) { observer.observe(el); });
    }

    /* ---- Boot ------------------------------------------------------------ */

    function ready(fn) {
        if (document.readyState !== 'loading') fn();
        else document.addEventListener('DOMContentLoaded', fn);
    }

    ready(function () {
        applyStagger();
        initReveal();
        initCounters();

        Promise.all([
            inject('header.html', 'header-placeholder'),
            inject('footer.html', 'footer-placeholder')
        ]).then(function () {
            // Icons inside the injected partials only exist now.
            if (window.feather) window.feather.replace();
            initNav();
        });

        // Icons in the page body can be drawn immediately.
        if (window.feather) window.feather.replace();
    });
})();
