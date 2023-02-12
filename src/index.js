import { Notify } from "notiflix";
import { ImagesApiService } from './js/images-service';
import { createImagesCardMarkup } from './js/images-card-markup';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

const refs = {
    form: document.getElementById('search-form'),
    gallery: document.querySelector('.gallery'),
    loadMoreBtn: document.querySelector('.load-more'),
}

const { form, gallery, loadMoreBtn } = refs;

const imagesApiService = new ImagesApiService();

let lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});

form.addEventListener('submit', onSearch);

function onSearch(e) {
    e.preventDefault();
    cleanMarkup();

    imagesApiService.query = e.currentTarget.elements.searchQuery.value.trim();

    if (imagesApiService.query === '') {
        loadMoreBtnIsHidden();
        return Notify.failure('Field cant be empty.')
    }

    e.currentTarget.reset();

    imagesApiService.page = 1;
    imagesApiService.shownImages = 0;
    
    onRequestToApi();
}

async function onRequestToApi() {
    try {
        const { hits, totalHits } = await imagesApiService.fetchImages();

        if (totalHits === 0) {
            Notify.failure("Sorry, there are no images matching your search query. Please try again.");
            loadMoreBtnIsHidden();
            return;
        }

        if (imagesApiService.shownImages === 0) {
            Notify.info(`Hooray! We found ${totalHits} images.`);
        }

        loadMoreBtnNotHidden();

        imagesApiService.shownImages += hits.length;

        const markup = await createImagesCardMarkup(hits);

        markupIntoInterface(markup);

        lightbox.refresh()

        if (imagesApiService.shownImages === totalHits) {
            Notify.info("We're sorry, but you've reached the end of search results.");

            loadMoreBtnIsHidden();
            
            return;
        }

    } catch (error) {
        Notify.failure(error.message);
    }
}

loadMoreBtn.addEventListener('click', onLoadMoreBtn)

function onLoadMoreBtn(e) {
    e.preventDefault();

    imagesApiService.pageIncrement();

    onRequestToApi();
}

function markupIntoInterface(markup) {
    gallery.insertAdjacentHTML('beforeend', markup);
}

function cleanMarkup() {
    gallery.innerHTML = '';
}

function loadMoreBtnIsHidden() {
    loadMoreBtn.classList.add('is-hidden');
}

function loadMoreBtnNotHidden() {
    loadMoreBtn.classList.remove('is-hidden');
}