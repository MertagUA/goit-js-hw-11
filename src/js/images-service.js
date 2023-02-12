import axios from 'axios';

export class ImagesApiService{
    constructor() {
        this.searchQuery = '';
        this.page = 1;
        this.shownImages = 0;
    }

    async fetchImages() {
    const BASE_URL = 'https://pixabay.com/api/';

    const searchParams = new URLSearchParams({
      key: '33576699-07be5d69785ba9c233ec2014b',
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      per_page: 40,
    });

    const response = await axios.get(
      `${BASE_URL}?${searchParams}&q=${this.searchQuery}&page=${this.page}`
    );

        return response.data;
    }
    get query() {
        return this.searchQuery;
    }
    set query(newQuery) {
        this.searchQuery = newQuery;
    }
    pageIncrement() {
        this.page = this.page + 1;
    }
}