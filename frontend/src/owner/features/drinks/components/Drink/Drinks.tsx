import Layout from '../../../../shared/components/Layout/Layout'
import DrinksHeader from './DrinksHeader'
import DrinksFilters from './DrinksFilters'
import DrinksList from './DrinksList'
import DrinksEmpty from './DrinksEmpty'
import DrinksLoading from './DrinksLoading'
import OrderSidebar from '../../../orders/components/Orders/OrderSidebar'
import { useDrinksPage } from '../../hooks/Drink/useDrinksPage'
import '../../../../../css/owner/Drinks.css'

export default function Drinks() {
  const {
    establishmentCode,
    isOwner,
    drinks,
    tags,
    selectedTags,
    loading,
    error,
    toggleTag,
    searchTerm,
    setSearchTerm,
    deleteDrink,
    deleting
  } = useDrinksPage()

  if (loading) {
    return <DrinksLoading />
  }

  return (
    <Layout>
      <div className="drinks-container">
        <DrinksHeader establishmentCode={establishmentCode} isOwner={isOwner} />
        
        <DrinksFilters 
          tags={tags} 
          selectedTags={selectedTags} 
          onToggleTag={toggleTag}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />

        {error && (
          <div className="alert alert-danger mb-4">
            {error}
          </div>
        )}

        {drinks.length > 0 ? (
          <DrinksList
            drinks={drinks}
            establishmentCode={establishmentCode}
            isOwner={isOwner}
            onDelete={deleteDrink}
            deleting={deleting}
          />
        ) : (
          <DrinksEmpty establishmentCode={establishmentCode} isOwner={isOwner} />
        )}
      </div>
      
      <OrderSidebar establishmentCode={establishmentCode} />
    </Layout>
  )
}