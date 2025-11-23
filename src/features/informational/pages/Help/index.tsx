import { useHelpPageTour } from "../../hooks/useHelpPageTour";
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { faqCategories, faqData, getCategoryIcon } from "@/shared/utils/faqData";
import { BlueTitleCard } from "@/shared/components/UI/BlueTitleCard";
import { Header } from "@/shared/components/Layout/Header";
import { TourGuide } from "@/shared/components/tour/TourGuide";
import { Footer } from "@/shared/components/Layout/Footer";
import { TourRestartButton } from "@/shared/components/tour/TourRestartButton";

export function HelpPage() {
  const [openItem, setOpenItem] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const tour = useHelpPageTour();

  // Filtrar FAQ por busca e categoria
  const filteredFaq = useMemo(() => {
    return faqData.filter((item) => {
      const matchesSearch =
        searchQuery === "" ||
        item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.tags?.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCategory = !selectedCategory || item.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  const toggleItem = (index: number) => {
    setOpenItem(openItem === index ? null : index);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory(null);
    setOpenItem(null);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <BlueTitleCard
        title="Central de Ajuda"
        subtitle="Encontre respostas para suas dúvidas sobre o portal, funcionalidades e dados"
      />

      <div className="flex-grow bg-gradient-to-b from-gray-50 to-white py-8 sm:py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Barra de busca */}
          <div className="mb-8" data-tour="search-bar">
            <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-blue-100">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <svg
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                  <input
                    type="text"
                    placeholder="Buscar em perguntas, respostas e tags..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
                
                {(searchQuery || selectedCategory) && (
                  <button
                    onClick={clearFilters}
                    className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors font-medium flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Limpar Filtros
                  </button>
                )}
              </div>

              {(searchQuery || selectedCategory) && (
                <div className="mt-4 flex items-center gap-2 text-sm text-gray-600">
                  <span className="font-medium">{filteredFaq.length} resultados encontrados</span>
                  {selectedCategory && (
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                      {selectedCategory}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Navegação por categorias */}
          <div className="mb-8" data-tour="quick-navigation">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              Categorias
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {faqCategories.map((category) => {
                const count = faqData.filter((item) => item.category === category).length;
                const isSelected = selectedCategory === category;

                return (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(isSelected ? null : category)}
                    className={`
                      p-4 rounded-xl transition-all duration-200 text-left
                      ${
                        isSelected
                          ? "bg-blue-600 text-white shadow-lg scale-105"
                          : "bg-white hover:bg-blue-50 border-2 border-gray-200 hover:border-blue-300"
                      }
                    `}
                  >
                    <div className="flex items-start gap-3">
                      <svg
                        className={`w-6 h-6 flex-shrink-0 ${isSelected ? "text-white" : "text-blue-600"}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d={getCategoryIcon(category)}
                        />
                      </svg>
                      <div className="flex-1 min-w-0">
                        <h3 className={`font-semibold text-sm mb-1 ${isSelected ? "text-white" : "text-gray-900"}`}>
                          {category}
                        </h3>
                        <p className={`text-xs ${isSelected ? "text-blue-100" : "text-gray-500"}`}>
                          {count} {count === 1 ? "pergunta" : "perguntas"}
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Lista de FAQ */}
          <AnimatePresence mode="wait">
            {filteredFaq.length > 0 ? (
              <motion.div
                key="faq-list"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                {faqCategories.map((category) => {
                  const categoryItems = filteredFaq.filter((item) => item.category === category);
                  if (categoryItems.length === 0) return null;

                  return (
                    <div key={category} className="space-y-3">
                      <h2
                        id={category.replace(/\s+/g, "-").toLowerCase()}
                        className="text-2xl font-bold text-gray-900 flex items-center gap-3 pb-3 border-b-2 border-blue-600"
                      >
                        <svg
                          className="w-7 h-7 text-blue-600"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d={getCategoryIcon(category)}
                          />
                        </svg>
                        {category}
                      </h2>

                      {categoryItems.map((item) => {
                        const globalIndex = faqData.indexOf(item);
                        const isOpen = openItem === globalIndex;

                        return (
                          <motion.div
                            key={globalIndex}
                            layout
                            className="bg-white rounded-xl shadow-md border-2 border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
                            data-tour={globalIndex === 0 ? "faq-item" : undefined}
                          >
                            <button
                              onClick={() => toggleItem(globalIndex)}
                              className="w-full px-5 py-4 text-left flex justify-between items-start hover:bg-gray-50 transition-colors"
                            >
                              <div className="flex-1 pr-4">
                                <h3 className="font-semibold text-gray-900 text-base mb-1">
                                  {item.question}
                                </h3>
                                {item.tags && item.tags.length > 0 && (
                                  <div className="flex flex-wrap gap-1.5 mt-2">
                                    {item.tags.slice(0, 3).map((tag, idx) => (
                                      <span
                                        key={idx}
                                        className="px-2 py-0.5 bg-blue-50 text-blue-600 text-xs rounded-full font-medium"
                                      >
                                        {tag}
                                      </span>
                                    ))}
                                  </div>
                                )}
                              </div>
                              <motion.svg
                                animate={{ rotate: isOpen ? 180 : 0 }}
                                transition={{ duration: 0.3 }}
                                className="w-5 h-5 text-gray-500 flex-shrink-0 mt-1"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M19 9l-7 7-7-7"
                                />
                              </motion.svg>
                            </button>

                            <AnimatePresence>
                              {isOpen && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: "auto", opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{ duration: 0.3 }}
                                  className="overflow-hidden"
                                >
                                  <div className="px-5 pb-4 border-t border-gray-200 pt-4">
                                    <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                                      {item.answer}
                                    </p>
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </motion.div>
                        );
                      })}
                    </div>
                  );
                })}
              </motion.div>
            ) : (
              <motion.div
                key="no-results"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="text-center py-16"
              >
                <svg
                  className="w-24 h-24 mx-auto text-gray-300 mb-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Nenhum resultado encontrado</h3>
                <p className="text-gray-600 mb-4">
                  Tente ajustar sua busca ou explorar as categorias disponíveis
                </p>
                <button
                  onClick={clearFilters}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Limpar Filtros
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* CTA de contato */}
          <div
            className="mt-12 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-2xl p-8 shadow-xl"
            data-tour="contact-section"
          >
            <div className="max-w-3xl mx-auto text-center">
              <svg
                className="w-16 h-16 mx-auto mb-4 text-blue-200"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h2 className="text-3xl font-bold mb-3">Não encontrou sua resposta?</h2>
              <p className="text-blue-100 text-lg mb-6">
                Nossa equipe está pronta para ajudar! Entre em contato e responderemos sua dúvida o mais rápido possível.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <a
                  href="/contato"
                  className="px-8 py-3 bg-white text-blue-600 rounded-xl font-semibold hover:bg-gray-100 transition-all transform hover:scale-105 shadow-lg flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  Formulário de Contato
                </a>
                <a
                  href="mailto:guilherme.cascavel@gmail.com"
                  className="px-8 py-3 bg-blue-800 text-white rounded-xl font-semibold hover:bg-blue-900 transition-all transform hover:scale-105 shadow-lg flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                    />
                  </svg>
                  Email Direto
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />

      <TourGuide
        isActive={tour.isActive}
        currentStep={tour.currentStep}
        totalSteps={tour.totalSteps}
        currentStepData={tour.currentStepData}
        onNext={tour.nextStep}
        onPrev={tour.prevStep}
        onSkip={tour.skipTour}
        onClose={tour.closeTour}
        onCancel={tour.cancelTour}
        onSkipAll={tour.skipAllTours}
      />

      <TourRestartButton
        onRestartTour={tour.restartTour}
        onRestartAllTours={tour.restartAllTours}
        tourKey="helpPage"
        completedTours={tour.completedTours}
        completedToursCount={tour.completedToursCount}
        isFirstTimeUser={tour.isFirstTimeUser}
      />
    </div>
  );
}