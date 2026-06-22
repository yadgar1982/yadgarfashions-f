import React from 'react';
import i18n from '../../../i18n'; // Make sure this path is correct
import { Select } from 'antd';
import { Image } from 'antd';
const { Option } = Select;

const LanguageSwitcher = () => {
  const handleChange = (value) => {
    if (i18n?.changeLanguage) {
      i18n.changeLanguage(value);
    }
  };

  return (
    <Select
      onChange={handleChange}
      value={i18n.language}
      className="-ml-3 w-[120px] text-sm font-semibold !border-none !shadow-none [&_.ant-select-selector]:!border-none [&_.ant-select-selector]:!shadow-none md:bg-transparent !text-[#3d3100] !font-bold "
      style={{ fontSize: '14px' }}
    >
      <Option value="fa">
        <span className="flex items-center gap-2 justify-between !text-[#3d3100] !font-semibold">
          دری
          <Image 
            src="https://flagcdn.com/w40/af.png"
            alt="Dari"
            preview={false}
            className=' md:!w-[30px] !w-[25px] !p-0'
          />

        </span>
      </Option>

      <Option value="ps">
        <span className="flex items-center gap-2 justify-between !text-[#3d3100] !font-semibold">
          پښتو
          <Image
            src="https://flagcdn.com/w40/af.png"
            alt="Pashto"
            preview={false}
            className='md:!w-[30px] !w-[25px] !p-0'
          />

        </span>
      </Option>

      <Option value="en">
        <span className="flex items-center gap-2 justify-between !text-[#3d3100] !font-semibold">
          English
          <Image
            src="https://flagcdn.com/w40/us.png"
            alt="English"
            preview={false}
            className='md:!w-[30px] !w-[25px] !p-0'
          />

        </span>
      </Option>
    </Select>
  );
};

export default LanguageSwitcher;
