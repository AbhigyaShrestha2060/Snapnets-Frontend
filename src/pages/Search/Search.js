import debounce from 'lodash/debounce';
import { Heart, Plus } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getImageByLike, likeImageApi } from '../../api/api';
import './Search.css';

const Search = () => {
  const [images, setImages] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    getImageByLike()
      .then((res) => {
        setImages(res.data.images);
        setSearchResults(res.data.images); // Initialize search results with all images
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  // Search images by keywords
  const debouncedSearch = debounce((query) => {
    const filteredImages = images.filter((image) =>
      image.keywords.some((keyword) =>
        keyword.toLowerCase().includes(query.toLowerCase())
      )
    );
    setSearchResults(filteredImages);
  }, 300);

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchTerm(query);
    debouncedSearch(query);
  };

  const toggleLike = async (index) => {
    const image = searchResults[index];
    const id = image._id;
    try {
      await likeImageApi(id);
      setSearchResults((prevImages) =>
        prevImages.map((img, i) =>
          i === index ? { ...img, isLikedByUser: !img.isLikedByUser } : img
        )
      );
    } catch (error) {
      console.log('Error liking the image:', error);
    }
  };

  const handleNavigation = (index) => {
    navigate(`/detailedProduct/${index}`);
  };

  return (
    <div className='gallery-container'>
      <div className='search-bar-container'>
        <input
          type='text'
          className='search-bar'
          placeholder='Search for images by keywords...'
          onChange={handleSearchChange}
          value={searchTerm}
        />
      </div>
      <div className='masonry-grid'>
        {searchResults.map((image, index) => (
          <div
            key={index}
            className={`masonry-item ${
              image.isPortrait ? 'portrait' : 'landscape'
            }`}>
            <div
              className='image-container'
              onClick={() => handleNavigation(image._id)}>
              <img
                src={`http://localhost:5050/images/${image.image}`}
                alt={`Image ${index + 1}`}
                className='gallery-image'
              />
              <div className='overlay'>
                <h3 className='title'>{image.imageTitle}</h3>
                <div className='action-buttons'>
                  <button
                    className={`like-btn ${image.isLikedByUser ? 'liked' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleLike(index);
                    }}>
                    <Heart
                      size={24}
                      className={image.isLikedByUser ? 'heart-filled' : ''}
                    />
                  </button>
                  <button
                    className='bid-btn'
                    onClick={(e) => {
                      e.stopPropagation();
                      console.log('Bid Now clicked');
                    }}>
                    Bid Now
                  </button>
                  <button
                    className='add-btn'
                    onClick={(e) => {
                      e.stopPropagation();
                      console.log('Add clicked');
                    }}>
                    <Plus size={24} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Search;
