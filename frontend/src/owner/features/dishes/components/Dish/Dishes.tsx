import Layout from '../../../../shared/components/Layout/Layout'
import DishesHeader from './DishesHeader'
import DishesFilters from './DishesFilters'
import DishesList from './DishesList'
import DishesEmpty from './DishesEmpty'
import DishesLoading from './DishesLoading'
import OrderSidebar from '../../../orders/components/Orders/OrderSidebar'
import { useDishesPage } from '../../hooks/Dish/useDishesPage'
import { useInfiniteScroll } from '../../../../../shared/hooks/useInfiniteScroll'
import { Dish } from '../../types/dish'
import '../../../../../css/owner/Dishes.css'

export default function Dishes() {
  const {
    establishmentCode,
    isOwner,
    dishes,
    tags,
    selectedTags,
    loading,
    toggleTag,
    searchTerm,
    setSearchTerm,
    deleteDish,
    deleting
  } = useDishesPage()

  const { displayedItems, sentinelRef } = useInfiniteScroll<Dish>(dishes, 12)

  if (loading) {
    return <DishesLoading />
  }

  return (
    <Layout>
      <div className="dishes-container">
        <DishesHeader establishmentCode={establishmentCode} isOwner={isOwner} />
        
        <DishesFilters 
          tags={tags} 
          selectedTags={selectedTags} 
          onToggleTag={toggleTag}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />

        {dishes.length > 0 ? (
          <>
            <DishesList
              dishes={displayedItems}
              establishmentCode={establishmentCode}
              isOwner={isOwner}
              onDelete={deleteDish}
              deleting={deleting}
            />
            <div ref={sentinelRef} data-testid="infinite-scroll-sentinel" style={{ height: 1 }} aria-hidden="true" />
          </>
        ) : (
          <DishesEmpty establishmentCode={establishmentCode} isOwner={isOwner} />
        )}
      </div>
      
      <OrderSidebar establishmentCode={establishmentCode} />
    </Layout>
  )
}

