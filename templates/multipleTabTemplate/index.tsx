import { Tabs } from 'antd'
import { OfficeTabs } from '@library/officeComponents'
import Tab1 from './Tab1'
import Tab2 from './Tab2'

const TabPane = Tabs.TabPane

export default function Template() {
  return (
    <OfficeTabs
      dataSource={[
        {
          url: '', // TODO set permission url
          element: (
            <TabPane tab="Table Template" key="TAB1">
              <Tab1 />
            </TabPane>
          )
        },
        {
          url: '', // TODO set permission url
          element: (
            <TabPane tab="Multiple Table Demo" key="TAB2">
              <Tab2 />
            </TabPane>
          )
        }
      ]}
    />
  )
}
