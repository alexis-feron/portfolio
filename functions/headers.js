exports.handler = async (event, context, callback) => {
  const { request, response } = event.Records[0].cf;
  const headers = response.headers;

  const headerCacheControl = 'Cache-Control';
  const defaultTimeToLive = 60 * 60 * 24 * 365;
  const fileExts = [
    '.js',
    '.css',
    '.json',
    '.ico',
    '.jpg',
    '.jpeg',
    '.woff',
    '.woff2',
    '.png',
    '.glb',
    '.gif',
    '.svg',
    '.mp4',
  ];

  // Asset caching headers
  if (response.status === '200') {
    if (!response.headers[headerCacheControl.toLowerCase()]) {
      // Only cache above-defined list of file types
      if (fileExts.findIndex(fileExt => request.uri.endsWith(fileExt)) >= 0) {
        response.headers[headerCacheControl.toLowerCase()] = [
          {
            key: headerCacheControl,
            value: `public, max-age=${defaultTimeToLive}`,
          },
        ];
      } else {
        response.headers[headerCacheControl.toLowerCase()] = [
          {
            key: headerCacheControl,
            value: `public, max-age=0`,
          },
        ];
      }
    }
  }

  // Security headers
  headers['Strict-Transport-Security'] = [
    {
      key: 'Strict-Transport-Security',
      value: 'max-age=63072000; includeSubDomains; preload',
    },
  ];

  headers['X-XSS-Protection'] = [
    {
      key: 'X-XSS-Protection',
      value: '1; mode=block',
    },
  ];

  headers['X-Content-Type-Options'] = [
    {
      key: 'X-Content-Type-Options',
      value: 'nosniff',
    },
  ];

  headers['X-Frame-Options'] = [
    {
      key: 'X-Frame-Options',
      value: 'SAMEORIGIN',
    },
  ];

  headers['Referrer-Policy'] = [
    { key: 'Referrer-Policy', value: 'no-referrer-when-downgrade' },
  ];

  headers['Content-Security-Policy'] = [
    {
      key: 'Content-Security-Policy',
      value: 'upgrade-insecure-requests;',
    },
  ];

  callback(null, response);
};
