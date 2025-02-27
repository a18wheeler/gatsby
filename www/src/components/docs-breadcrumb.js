import React from "react"
import { Link } from "gatsby"
import ChevronRight from "react-icons/lib/md/chevron-right"
import ChevronLeft from "react-icons/lib/md/chevron-left"
import getActiveItem from "../utils/sidebar/get-active-item"
import getActiveItemParents from "../utils/sidebar/get-active-item-parents"
import { mediaQueries, space, fontSizes } from "../utils/presets"

const Separator = ({ character = <ChevronRight /> }) => (
  <span style={{ margin: `0px ${space[1]}` }} role="presentation">
    {character}
  </span>
)

const BreadcrumbNav = ({ children, mobile = false }) => (
  <nav
    aria-label="breadcrumb"
    css={{
      fontSize: fontSizes[1],
      display: `${mobile ? `inherit` : `none`}`,
      [mediaQueries.md]: {
        display: `${mobile ? `none` : `inherit`}`,
      },
      marginBottom: space[2],
    }}
  >
    {children}
  </nav>
)

const Breadcrumb = ({ itemList, location }) => {
  const activeItem = getActiveItem(itemList.items, location, undefined)
  const activeItemParents = getActiveItemParents(itemList.items, activeItem, [])
  const topLevel = itemList.key
  const topLevelTitle = itemList.breadcrumbTitle || itemList.title
  // return a shorter version of the breadcrumb on the intro page
  // because the docs intro page isn't generated from markdown
  if (activeItem.title === `Introduction`) {
    return (
      <>
        {/* only the breadcrumb nav of the proper viewport is displayed */}
        <BreadcrumbNav>
          <Link to="/">Home</Link>
          <Separator />
          {topLevelTitle}
        </BreadcrumbNav>
        <BreadcrumbNav mobile>
          <Separator character="<" />
          <Link to="/">Home</Link>
        </BreadcrumbNav>
      </>
    )
  }

  return (
    <>
      {/* render the default view on desktop sizes with all links displayed */}
      <BreadcrumbNav>
        <Link to="/">Home</Link>
        <Separator />
        <Link to={`/${topLevel}/`}>{topLevelTitle}</Link>
        <Separator />
        {activeItemParents.reverse().map(item => {
          const itemTitle = item.breadcrumbTitle || item.title
          return (
            <React.Fragment key={itemTitle}>
              <span>
                <Link to={item.link}>{itemTitle}</Link>
              </span>
              <Separator />
            </React.Fragment>
          )
        })}
        <span aria-current="page">
          {activeItem.breadcrumbTitle || activeItem.title}
        </span>
      </BreadcrumbNav>
      {/* render a smaller view on mobile viewports with only previous breadcrumb */}
      {activeItemParents && (
        <BreadcrumbNav mobile>
          <Separator character={<ChevronLeft />} />
          <Link
            to={
              activeItemParents[activeItemParents.length - 1]
                ? activeItemParents[activeItemParents.length - 1].link
                : `/${topLevel}/`
            }
          >
            {activeItemParents[activeItemParents.length - 1]
              ? activeItemParents[activeItemParents.length - 1]
                  .breadcrumbTitle ||
                activeItemParents[activeItemParents.length - 1].title
              : topLevelTitle}
          </Link>
        </BreadcrumbNav>
      )}
    </>
  )
}

export default Breadcrumb
