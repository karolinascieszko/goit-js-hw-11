import axios from 'axios';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const qs = selector => document.querySelector(selector);
const qsa = selector => document.querySelectorAll(selector);

const searchForm = qs('#search-form');
const searchQuery = qs('input[name="searchQuery"]');
const loadMoreBtn = qs('.load-more');
const gallery = qs('.gallery');
let inputValue = searchQuery.value;

const API_KEY = '23724640-a43547237d07add70f9bfd33b';
let perPage = 40;
let page = 0;

const lightbox = () => new SimpleLightbox('.gallery a', {});

loadMoreBtn.style.display = 'none';

const fetchImages = async (searching, page) => {
  try {
    const response = await axios.get(
      `https://pixabay.com/api/?key=${API_KEY}&q=${searching}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${perPage}`,
    );
    console.log(response);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

const searchValueImages = async event => {
  event.preventDefault();
  gallery.innerHTML = '';
  page = 1;
  inputValue = searchQuery.value;

  fetchImages(inputValue, page)
    .then(inputValue => {
      let searchedImages = inputValue.hits.length;
      console.log(searchedImages);

      let totalPages = Math.ceil(inputValue.totalHits / perPage);
      console.log(totalPages);

      if (searchedImages > 0) {
        Notiflix.Notify.success(`Hooray! We found ${inputValue.totalHits} images.`);
        renderGallery(inputValue);
        lightbox();
        loadMoreBtn.style.display = 'block';
        if (page < totalPages) {
          loadMoreBtn.style.display = 'block';
        } else {
          loadMoreBtn.style.display = 'none';
          Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
        }
      } else {
        Notiflix.Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.',
        );
        gallery.innerHTML = '';
        loadMoreBtn.style.display = 'none';
      }
    })

    .catch(error => console.log(error));
};

searchForm.addEventListener('submit', searchValueImages);

const renderGallery = inputValue => {
  const markup = inputValue.hits
    .map(hit => {
      return `<div class="photo-card">
      <a class="gallery__item" href="${hit.largeImageURL}"> <img class="gallery__image" src="${hit.webformatURL}" alt="${hit.tags}" loading="lazy" /></a>
      <div class="info">
        <p class="info-item">
          <p class="info-item__description"><b >Likes</b> ${hit.likes}</p>
        </p>
        <p class="info-item">
          <p class="info-item__description"><b>Views</b> ${hit.views}</p>
        </p>
        <p class="info-item">
          <p class="info-item__description"><b>Comments</b> ${hit.comments}</p>
        </p>
        <p class="info-item">
          <p class="info-item__description"><b>Downloads</b> ${hit.downloads}</p>
        </p>
      </div>
    </div>`;
    })
    .join('');
  gallery.insertAdjacentHTML('beforeend', markup);
};

const loadMore = () => {
  inputValue = searchQuery.value;
  page += 1;
  fetchImages(inputValue, page).then(inputValue => {
    let totalPages = Math.ceil(inputValue.totalHits / perPage);
    renderGallery(inputValue);
    const { height: cardHeight } = document
      .querySelector('.gallery')
      .firstElementChild.getBoundingClientRect();

    window.scrollBy({
      top: cardHeight * 2,
      behavior: 'smooth',
    });
    lightbox().refresh();

    if (page >= totalPages) {
      loadMoreBtn.style.display = 'none';
      Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
    }
  });
};

loadMoreBtn.addEventListener('click', loadMore);
