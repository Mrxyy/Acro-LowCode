import React, { useEffect, useMemo, useState } from 'react';
import { Table, Tree, Checkbox } from '@arco-design/web-react';
import {
  isObject,
  isNumber,
  set,
  get,
  cloneDeep,
  cloneDeepWith,
  clone,
} from 'lodash';
import './index.less';
import { execRecursively } from './utils';

const TreeNode = Tree.Node;

const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
    fixed: 'left',
    width: 140,
  },
  {
    title: 'Information',
    children: [
      {
        title: 'Email',
        dataIndex: 'email',
      },
      {
        title: 'Phone',
        dataIndex: 'phone',
      },
    ],
  },
  {
    title: 'Salary',
    dataIndex: 'salary',
    fixed: 'right',
    width: 120,
  },
];

const data = [
  {
    key: '1',
    name: 'Jane Doe',
    salary: 23000,
    birthday: '1994-04-21',
    city: 'London',
    road: 'Park',
    no: '34',
    phone: '12345678',
    email: 'jane.doe@example.com',
  },
  {
    key: '2',
    name: 'Alisa Ross',
    salary: 25000,
    birthday: '1994-05-21',
    city: 'London',
    road: 'Park',
    no: '37',
    phone: '12345678',
    email: 'alisa.ross@example.com',
  },
  {
    key: '3',
    name: 'Kevin Sandra',
    salary: 22000,
    birthday: '1992-02-11',
    city: 'Paris',
    road: 'Arco',
    no: '67',
    phone: '12345678',
    email: 'kevin.sandra@example.com',
  },
  {
    key: '4',
    name: 'Ed Hellen',
    salary: 17000,
    birthday: '1991-06-21',
    city: 'London',
    road: 'Park',
    no: '317',
    phone: '12345678',
    email: 'ed.hellen@example.com',
  },
  {
    key: '5',
    name: 'William Smith',
    salary: 27000,
    birthday: '1996-08-21',
    city: 'Paris',
    road: 'Park',
    no: '114',
    phone: '12345678',
    email: 'william.smith@example.com',
  },
];

const TreeData = [
  {
    title: 'Name',
    key: '0-0',
  },
  {
    title: 'Information',
    key: '0-1',
    children: [
      {
        title: 'Email',
        key: '0-1-1',
        checkable: false,
      },
      {
        title: 'Phone',
        key: '0-1-2',
      },
    ],
  },
  {
    title: 'Salary',
    key: '0-2',
  },
];

function loopCloneInject(treeData) {
  return cloneDeepWith(treeData, (v, k) => {
    if (isObject(v) && isNumber(k)) {
      const cloneValue = clone(v);
      set(cloneValue, 'dataIndex', get(v, 'title').toLocaleLowerCase());
      return loopCloneInject(cloneValue);
    }
  });
}

function TableEngines() {
  const [treeData, setTreeData] = useState(TreeData);
  const columns = useMemo(() => {
    const result = loopCloneInject(treeData);
    return result;
  }, [treeData]);
  const [checked, setChecked] = useState(false);
  return (
    <div className="table-engines-page">
      <div className="table-engines">
        <div className="tool-box"></div>
        <div className="zw-table">
          <Table
            scroll={{ x: 1200 }}
            border={{ wrapper: true, cell: true }}
            columns={columns}
            data={data}
          />
        </div>
      </div>
      <div className="operation-columns-box">
        <Checkbox
          checked={checked}
          onChange={setChecked}
          style={{ marginBottom: 20 }}
        >
          批量操作
        </Checkbox>
        <Tree
          draggable
          blockNode
          checkable={checked}
          onDrop={({ dragNode, dropNode, dropPosition }) => {
            const loop = (data, key, callback) => {
              data.some((item, index, arr) => {
                if (item.key === key) {
                  callback(item, index, arr);
                  return true;
                }
                if (item.children) {
                  return loop(item.children, key, callback);
                }
              });
            };
            const data = [...treeData];
            let dragItem;
            loop(data, dragNode.props._key, (item, index, arr) => {
              arr.splice(index, 1);
              dragItem = item;
              dragItem.className = 'tree-node-dropover';
            });
            if (dropPosition === 0) {
              loop(data, dropNode.props._key, (item, index, arr) => {
                item.children = item.children || [];
                item.children.push(dragItem);
              });
            } else {
              loop(data, dropNode.props._key, (item, index, arr) => {
                arr.splice(dropPosition < 0 ? index : index + 1, 0, dragItem);
              });
            }
            setTreeData([...data]);

            setTimeout(() => {
              dragItem.className = '';
              setTreeData([...data]);
            }, 1000);
          }}
          treeData={treeData}
        ></Tree>
      </div>
    </div>
  );
}
export default TableEngines;
