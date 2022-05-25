import './index.css'
// Write your code here
const TabItem = props => {
  const renderCategoriesList = () => {
    const {bookshelvesList} = props

    return bookshelvesList.map(category => {
      const {changeCategory, activeCategoryId, activeLabel, changeLabel} = props
      console.log(activeLabel)
      const onClickButton = () => {
        changeCategory(category.value)
        //  console.log(category.value)
        changeLabel(category.label)
        //  console.log(category.label)
      }

      const isActive = category.value === activeCategoryId
      const categoryClassName = isActive ? `tab-button active` : `tab-button`

      return (
        <li className="tab-item" key={category.id}>
          <button
            type="button"
            onClick={onClickButton}
            className={categoryClassName}
          >
            {category.label}
          </button>
        </li>
      )
    })
  }
  return <>{renderCategoriesList()}</>
}
export default TabItem
