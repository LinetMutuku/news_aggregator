import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { ExternalLink, Bookmark, Share2, Clock, User } from 'lucide-react';

const ArticleDetail = () => {
    const [isBookmarked, setIsBookmarked] = useState(false);
    const selectedArticle = useSelector(state => state.articles.selectedArticle);
    const articles = useSelector(state => state.articles.articles);
    const savedArticles = useSelector(state => state.articles.savedArticles);

    const article = selectedArticle ?
        (articles.find(a => a._id === selectedArticle) || savedArticles.find(a => a._id === selectedArticle))
        : null;

    if (!article) {
        return null;
    }

    const imageUrl = article.urlToImage || article.imageUrl;

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: article.title,
                text: article.description,
                url: article.url,
            });
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <article className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden transform transition-all duration-300 hover:shadow-2xl">
                {/* Top Action Bar */}
                <div className="bg-gray-50 px-6 py-4 flex justify-between items-center border-b">
                    <div className="flex items-center space-x-2">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                            {article.source}
                        </span>
                        <div className="flex items-center text-gray-500 text-sm">
                            <Clock className="h-4 w-4 mr-1" />
                            {new Date(article.publishedAt).toLocaleDateString()}
                        </div>
                    </div>
                    <div className="flex space-x-4">
                        <button
                            onClick={() => setIsBookmarked(!isBookmarked)}
                            className={`p-2 rounded-full transition-colors duration-200 ${
                                isBookmarked ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'
                            }`}
                        >
                            <Bookmark className="h-5 w-5" />
                        </button>
                        <button
                            onClick={handleShare}
                            className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
                        >
                            <Share2 className="h-5 w-5 text-gray-600" />
                        </button>
                    </div>
                </div>

                {/* Hero Section */}
                {imageUrl && (
                    <div className="relative">
                        <div className="aspect-w-16 aspect-h-9">
                            <img
                                src={imageUrl}
                                alt={article.title}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                    </div>
                )}

                {/* Content Section */}
                <div className={`px-8 py-6 ${imageUrl ? '-mt-32 relative z-10' : ''}`}>
                    <h1 className={`text-4xl font-bold leading-tight mb-4 ${
                        imageUrl ? 'text-white' : 'text-gray-900'
                    }`}>
                        {article.title}
                    </h1>

                    <div className="flex items-center space-x-4 mb-8">
                        <div className="flex items-center">
                            <User className="h-5 w-5 text-gray-400 mr-2" />
                            <span className={`${imageUrl ? 'text-gray-300' : 'text-gray-600'}`}>
                                {article.author || 'Unknown Author'}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Article Body */}
                <div className="px-8 py-6">
                    <p className="text-xl text-gray-700 font-medium leading-relaxed mb-6">
                        {article.description}
                    </p>

                    <div className="prose max-w-none">
                        <p className="text-gray-600 leading-relaxed mb-8 text-lg">
                            {article.content}
                        </p>
                    </div>

                    {/* Tags Section */}
                    <div className="flex flex-wrap gap-2 mb-8">
                        {['News', 'Article', 'Featured'].map((tag) => (
                            <span key={tag} className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">
                                {tag}
                            </span>
                        ))}
                    </div>

                    {/* Call to Action */}
                    <div className="flex justify-between items-center border-t pt-6">
                        <a
                            href={article.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 transform hover:-translate-y-1 hover:shadow-lg"
                        >
                            <span>Read full article</span>
                            <ExternalLink className="ml-2 h-4 w-4" />
                        </a>

                        <div className="flex items-center space-x-4">
                            <button className="text-gray-500 hover:text-gray-700 transition-colors duration-200">
                                <Share2 className="h-5 w-5" />
                            </button>
                            <button
                                onClick={() => setIsBookmarked(!isBookmarked)}
                                className={`transition-colors duration-200 ${
                                    isBookmarked ? 'text-blue-600' : 'text-gray-500 hover:text-gray-700'
                                }`}
                            >
                                <Bookmark className="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </article>
        </div>
    );
};

export default ArticleDetail;