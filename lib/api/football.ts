/**
 * Football API Client
 * Supports both API-Football (RapidAPI) and Football-Data.org
 */

const FOOTBALL_API_KEY = process.env.FOOTBALL_API_KEY;
const FOOTBALL_API_HOST = process.env.FOOTBALL_API_HOST || 'api-football-v1.p.rapidapi.com';
const FOOTBALL_DATA_ORG_KEY = process.env.FOOTBALL_DATA_ORG_KEY;

const API_FOOTBALL_BASE_URL = `https://${FOOTBALL_API_HOST}`;
const FOOTBALL_DATA_ORG_BASE_URL = 'https://api.football-data.org/v4';

export interface ApiFootballFixture {
  fixture: {
    id: number;
    date: string;
    status: {
      long: string;
      short: string;
    };
    venue: {
      name: string;
      city: string;
    };
    referee?: string;
  };
  league: {
    id: number;
    name: string;
    country: string;
    logo: string;
    season: number;
    round?: string;
  };
  teams: {
    home: {
      id: number;
      name: string;
      logo: string;
    };
    away: {
      id: number;
      name: string;
      logo: string;
    };
  };
  goals: {
    home?: number;
    away?: number;
  };
  score: {
    halftime: {
      home?: number;
      away?: number;
    };
  };
}

/**
 * Fetch upcoming fixtures from API-Football
 */
export async function fetchUpcomingFixtures(leagueId?: number, days: number = 7) {
  if (!FOOTBALL_API_KEY) {
    throw new Error('FOOTBALL_API_KEY is not configured');
  }

  const today = new Date();
  const endDate = new Date();
  endDate.setDate(today.getDate() + days);

  const params = new URLSearchParams({
    from: today.toISOString().split('T')[0],
    to: endDate.toISOString().split('T')[0],
  });

  if (leagueId) {
    params.append('league', leagueId.toString());
  }

  const response = await fetch(`${API_FOOTBALL_BASE_URL}/fixtures?${params}`, {
    headers: {
      'X-RapidAPI-Key': FOOTBALL_API_KEY,
      'X-RapidAPI-Host': FOOTBALL_API_HOST,
    },
  });

  if (!response.ok) {
    throw new Error(`API-Football error: ${response.statusText}`);
  }

  const data = await response.json();
  return data.response as ApiFootballFixture[];
}

/**
 * Fetch team information
 */
export async function fetchTeam(teamId: number) {
  if (!FOOTBALL_API_KEY) {
    throw new Error('FOOTBALL_API_KEY is not configured');
  }

  const response = await fetch(`${API_FOOTBALL_BASE_URL}/teams?id=${teamId}`, {
    headers: {
      'X-RapidAPI-Key': FOOTBALL_API_KEY,
      'X-RapidAPI-Host': FOOTBALL_API_HOST,
    },
  });

  if (!response.ok) {
    throw new Error(`API-Football error: ${response.statusText}`);
  }

  const data = await response.json();
  return data.response[0] as { team: any; venue: any };
}

/**
 * Fetch league standings
 */
export async function fetchLeagueStandings(leagueId: number, season: number = 2024) {
  if (!FOOTBALL_API_KEY) {
    throw new Error('FOOTBALL_API_KEY is not configured');
  }

  const response = await fetch(
    `${API_FOOTBALL_BASE_URL}/standings?league=${leagueId}&season=${season}`,
    {
      headers: {
        'X-RapidAPI-Key': FOOTBALL_API_KEY,
        'X-RapidAPI-Host': FOOTBALL_API_HOST,
      },
    }
  );

  if (!response.ok) {
    throw new Error(`API-Football error: ${response.statusText}`);
  }

  const data = await response.json();
  return data.response[0]?.league?.standings?.[0] || [];
}

/**
 * Fetch match statistics
 */
export async function fetchMatchStatistics(fixtureId: number) {
  if (!FOOTBALL_API_KEY) {
    throw new Error('FOOTBALL_API_KEY is not configured');
  }

  const response = await fetch(`${API_FOOTBALL_BASE_URL}/fixtures/statistics?fixture=${fixtureId}`, {
    headers: {
      'X-RapidAPI-Key': FOOTBALL_API_KEY,
      'X-RapidAPI-Host': FOOTBALL_API_HOST,
    },
  });

  if (!response.ok) {
    throw new Error(`API-Football error: ${response.statusText}`);
  }

  const data = await response.json();
  return data.response as Array<{ team: any; statistics: any[] }>;
}

