  export class Github {
  static GITHUB_API_URL = 'https://api.github.com/users/';
  static GITHUB_CONTRIB_API_URL = 'https://github-contributions-api.deno.dev/';
  
  constructor() {
    this.config = {
      username: 'mauricioboninno'
    };

    this.elements = {
      username: document.getElementById('github-username'),
      avatar: document.getElementById('github-avatar'),
      followers: document.getElementById('github-followers'),
      contributions: document.getElementById('github-contributions'),
      createdAgo: document.getElementById('github-createdAgo')
    };

    this.state = {
      userData: null,
      contribData: null,
      fetching: false
    };
  }

  startFetching() {
    this.init();
  }

  init() {
    this.fetchGithubData();
  }

  async fetchGithubData() {
    if(this.state.fetching) return;

    this.state.fetching = true;

    try {
      const { username } = this.config;

      const [userRes, contribRes] = await Promise.all([
        fetch(`${Github.GITHUB_API_URL}${username}`),
        fetch(`${Github.GITHUB_CONTRIB_API_URL}${username}.json`)
      ]);

      if(!userRes.ok || !contribRes.ok) {
        throw new Error('Failed to fetch GitHub data');
      }

      const userData = await userRes.json();
      const contribData = await contribRes.json();

      this.state.userData = userData;
      this.state.contribData = contribData;

      this.updateDisplay(userData, contribData);
    } catch (error) {
      console.error(error);
    } finally {
      this.state.fetching = false;
    }
  }

  calculateDaysAgo(dateString) {
    const createdDate = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - createdDate);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  updateDisplay(userData, contribData) {
    const { username, avatar, followers, contributions, createdAgo} = this.elements;

    username.textContent = userData.login || 'Unknown User';
    avatar.style.backgroundImage = `url('${userData.avatar_url || ''}')`;
    followers.textContent = `Followers: ${userData.followers || 0}`;
    contributions.textContent = `Contributions: ${contribData.totalContributions || 0}`;

    const diffDays = this.calculateDaysAgo(userData.created_at);
    createdAgo.textContent = `Joined ${diffDays} days ago`;
  }
}