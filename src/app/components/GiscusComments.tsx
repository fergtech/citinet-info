import { useEffect } from 'react';

export function GiscusComments() {
  useEffect(() => {
    const container = document.getElementById('giscus-container');
    if (!container || container.hasChildNodes()) return;

    const script = document.createElement('script');
    script.src = 'https://giscus.app/client.js';

    // Get these values from https://giscus.app after:
    // 1. Enabling Discussions on github.com/fergtech/citinet (Settings → Features → Discussions)
    // 2. Installing the Giscus GitHub App on that repo
    // 3. Visiting giscus.app and configuring it
    script.setAttribute('data-repo',              'fergtech/citinet');
    script.setAttribute('data-repo-id',           'REPLACE_WITH_REPO_ID');
    script.setAttribute('data-category',          'Blog Comments');
    script.setAttribute('data-category-id',       'REPLACE_WITH_CATEGORY_ID');
    script.setAttribute('data-mapping',           'pathname');
    script.setAttribute('data-strict',            '0');
    script.setAttribute('data-reactions-enabled', '1');
    script.setAttribute('data-emit-metadata',     '0');
    script.setAttribute('data-input-position',    'top');
    script.setAttribute('data-theme',             'dark_dimmed');
    script.setAttribute('data-lang',              'en');
    script.setAttribute('data-loading',           'lazy');
    script.crossOrigin = 'anonymous';
    script.async = true;
    container.appendChild(script);
  }, []);

  return (
    <div className="mt-16 pt-8 border-t border-white/10">
      <p className="text-xs text-slate-600 mb-5">
        Comments via{' '}
        <a
          href="https://giscus.app"
          target="_blank"
          rel="noopener noreferrer"
          className="text-violet-400 hover:text-violet-300 transition-colors"
        >
          Giscus
        </a>
        {' '}· GitHub account required
      </p>
      <div id="giscus-container" />
    </div>
  );
}
