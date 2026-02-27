
const TMDB_API_KEY = process.env.TMDB_API_KEY || '';
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

async function testLang(lang) {
    const params = new URLSearchParams({
        api_key: TMDB_API_KEY,
        sort_by: 'popularity.desc',
        'vote_average.gte': '6',
        'vote_count.gte': '10',
        with_original_language: lang,
        language: lang,
        page: '1'
    });

    const url = `${TMDB_BASE_URL}/discover/movie?${params.toString()}`;
    console.log(`Testing ${lang}: ${url}`);

    try {
        const res = await fetch(url);
        const data = await res.json();
        console.log(`Results for ${lang}: ${data.results ? data.results.length : 0}`);
        if (data.results && data.results.length > 0) {
            console.log(`Top result: ${data.results[0].title} (Original Lang: ${data.results[0].original_language})`);
        } else {
            console.log(`Full response: ${JSON.stringify(data)}`);
        }
    } catch (e) {
        console.error(`Error for ${lang}: ${e.message}`);
    }
}

async function run() {
    await testLang('hi');
    await testLang('fr');
    await testLang('de');
    await testLang('it');
}

run();
