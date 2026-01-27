import Layout from '../Layout/Layout'
import DishesHeader from './DishesHeader'
import DishesFilters from './DishesFilters'
import DishesList from './DishesList'
import DishesEmpty from './DishesEmpty'
import DishesLoading from './DishesLoading'
import { useDishesPage } from '../../hooks/Dish/useDishesPage'
import '../../../css/owner/Dishes.css'

export default function Dishes() {
  const {
    establishmentCode,
    isOwner,
    dishes,
    tags,
    selectedTags,
    loading,
    toggleTag,
    deleteDish,
    deleting
  } = useDishesPage()

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
        />

        {dishes.length > 0 ? (
          <DishesList
            dishes={dishes}
            establishmentCode={establishmentCode}
            isOwner={isOwner}
            onDelete={deleteDish}
            deleting={deleting}
          />
        ) : (
          <DishesEmpty establishmentCode={establishmentCode} isOwner={isOwner} />
        )}
      </div>
    </Layout>
  )
}

