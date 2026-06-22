import { Form, Button, Tabs, Input, Image, Modal } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { resetModal } from "../../../../redux/slices/modals.slice";
import menImg from "../../../../public/men.jpg";
import womenImg from "../../../../public/women.jpg";
import waistcoatImg from "../../../../public/waistcoat.jpg";
import TextArea from "antd/es/input/TextArea";
import { useTranslation } from 'react-i18next';
const { TabPane } = Tabs;

export const WaistcoatModal = () => {
    const { t } = useTranslation('sizing');
    const [waistForm] = Form.useForm();
    const dispatch = useDispatch();
    const modalSlice = useSelector((res) => res.modalSlice);
    modalSlice.waistcoatModalData && waistForm.setFieldsValue(modalSlice.waistcoatModalData);

    const capitalizeFirstLetter = (string) => {
        if (!string) return '';
        return string.charAt(0).toUpperCase() + string.slice(1);
    };

    return (
        <Modal
            open={modalSlice.waistcoatModal}
            onCancel={() => dispatch(resetModal())}
            footer={null}
            title={null}       // hide default title
            closable={false}
            className="!w-[95%] md:!w-[80%] "
            bodyStyle={{ padding: 0 }}
        >
            <div className="bg-[#C68E17] text-white font-bold text-lg px-6 py-4 flex justify-between items-center rounded-t-[4px]">
                {t(`Waist Coat Custom Stitched in Inches  ${modalSlice.waistcoatModalData?.productName}`)}
                <button
                    onClick={() => dispatch(resetModal())}
                    className="text-white hover:text-gray-200 text-xl font-bold"
                >
                    ×
                </button>
            </div>
            <div className="grid md:grid-cols-3 gap-3">
                <div className="md:col-span-2 mt-12">
                    <Form form={waistForm} layout="vertical"  >
                        <div className="grid md:grid-cols-3 grid-cols-2 gap-x-1  ">
                            <Form.Item name="heightSize" label="Height">
                                <Input
                                    disabled
                                    className="!rounded-none border-sm !border-[#C68E17] border-transparent disabled:bg-transparent disabled:text-black disabled:opacity-100" size="large" />
                            </Form.Item>
                            <Form.Item name="shoulderSize" label="Shoulder">
                                <Input
                                    disabled
                                    className="!rounded-none border-sm !border-[#C68E17] border-transparent disabled:bg-transparent disabled:text-black disabled:opacity-100"
                                    size="large" />
                            </Form.Item>
                            <Form.Item name="neckSize" label="Around Neck">
                                <Input
                                    disabled
                                    className="!rounded-none border-sm !border-[#C68E17] border-transparent disabled:bg-transparent disabled:text-black disabled:opacity-100" size="large" />
                            </Form.Item>
                            <Form.Item name="armholeSize" label="Arm Hole">
                                <Input
                                    disabled
                                    className="!rounded-none border-sm !border-[#C68E17] border-transparent disabled:bg-transparent disabled:text-black disabled:opacity-100" size="large" />
                            </Form.Item>
                            <Form.Item name="waistSize" label="Waist" >
                                <Input
                                    disabled
                                    className="!rounded-none border-sm !border-[#C68E17] border-transparent disabled:bg-transparent disabled:text-black disabled:opacity-100" size="large" />
                            </Form.Item>
                             <Form.Item
                            name="bustSize" label={t("Around Bust")}>
                            <Input className="!rounded-none border-sm !border-[#C68E17] border-transparent disabled:bg-transparent disabled:text-black disabled:opacity-100" disabled size="large" />
                        </Form.Item>
                            <Form.Item name="hipsSize" label="Hips">
                                <Input
                                    disabled
                                    className="!rounded-none border-sm !border-[#C68E17] border-transparent disabled:bg-transparent disabled:text-black disabled:opacity-100" size="large" />
                            </Form.Item>

                        </div>
                        <Form.Item name="otherDetails" label="Other Details">
                            <TextArea
                                disabled
                                className="!rounded-none border-sm !border-[#C68E17] border-transparent disabled:bg-transparent disabled:text-black disabled:opacity-100" size="large" />
                        </Form.Item>
                    </Form>
                </div>

                <div className="">
                    <Image preview={true} src={waistcoatImg} className="w-full" alt="men-img" />
                </div>
            </div>
        </Modal>
    )
}

export const WomenModal = () => {
    const { t } = useTranslation('sizing');
    const [womenForm] = Form.useForm();
    const dispatch = useDispatch();
    const modalSlice = useSelector((res) => res.modalSlice);
    modalSlice.womenModalData && womenForm.setFieldsValue(modalSlice.womenModalData);
    return (
        <Modal
            open={modalSlice.womenModal}
            onCancel={() => dispatch(resetModal())}
            footer={null}
            title={null}       // hide default title
            closable={false}
            className="!w-[95%] md:!w-[80%] "
            bodyStyle={{ padding: 0 }}
        >
            <div className="bg-[#C68E17] text-white font-bold text-lg px-6 py-4 flex justify-between items-center rounded-t-[4px]">
                {t(`Women Custom Stitched ${modalSlice.womenModalData?.productName}`)}
                <button
                    onClick={() => dispatch(resetModal())}
                    className="text-white hover:text-gray-200 text-xl font-bold"
                >
                    ×
                </button>
            </div>
            <div className="md:flex md:justify-between mt-4">
                <Form form={womenForm} layout="vertical" className="p- md:w-[68%]">
                    <div className="grid md:grid-cols-4 grid-cols-2 gap-1">
                        <Form.Item name="neckBackSize" label={t("Back Neck Depth")}>
                            <Input disabled
                                className="!rounded-none border-sm !border-[#C68E17] border-transparent disabled:bg-transparent disabled:text-black disabled:opacity-100" size="large" />
                        </Form.Item>
                        <Form.Item name="neckFrontSize" label={t('Front Neck Depth')}>
                            <Input className="!rounded-none border-sm !border-[#C68E17] border-transparent disabled:bg-transparent disabled:text-black disabled:opacity-100"
                                disabled size="large" />
                        </Form.Item>
                        <Form.Item name="sleeveLengthSize" label={t("Sleeve Length")}>
                            <Input className="!rounded-none border-sm !border-[#C68E17] border-transparent disabled:bg-transparent disabled:text-black disabled:opacity-100" disabled size="large" />
                        </Form.Item>
                        <Form.Item name="armSize" label={t("Around Arm")}>
                            <Input className="!rounded-none border-sm !border-[#C68E17] border-transparent disabled:bg-transparent disabled:text-black disabled:opacity-100" disabled size="large" />
                        </Form.Item>
                        <Form.Item name="soulderWidthSize" label={t("Shoulder Width")}>
                            <Input className="!rounded-none border-sm !border-[#C68E17] border-transparent disabled:bg-transparent disabled:text-black disabled:opacity-100" disabled size="large" />
                        </Form.Item>
                        <Form.Item
                            name="bustSize" label={t("Around Bust")}>
                            <Input className="!rounded-none border-sm !border-[#C68E17] border-transparent disabled:bg-transparent disabled:text-black disabled:opacity-100" disabled size="large" />
                        </Form.Item>
                        <Form.Item name="sleaveSize" label={t("Around Sleeve")}>
                            <Input className="!rounded-none border-sm !border-[#C68E17] border-transparent disabled:bg-transparent disabled:text-black disabled:opacity-100" disabled size="large" />
                        </Form.Item>

                        <Form.Item name="armHoleSize" label={t("Arm Hole")}>
                            <Input className="!rounded-none border-sm !border-[#C68E17] border-transparent disabled:bg-transparent disabled:text-black disabled:opacity-100" disabled size="large" />
                        </Form.Item>
                        <Form.Item name="waistSize" label={t("Around Waist")}>
                            <Input className="!rounded-none border-sm !border-[#C68E17] border-transparent disabled:bg-transparent disabled:text-black disabled:opacity-100" disabled size="large" />
                        </Form.Item>
                        <Form.Item name="hipsSize" label={t("Around Hips")}>
                            <Input className="!rounded-none border-sm !border-[#C68E17] border-transparent disabled:bg-transparent disabled:text-black disabled:opacity-100" disabled size="large" />
                        </Form.Item>
                        <Form.Item name="thighsSize" label={t("Around Thigh")}>
                            <Input className="!rounded-none border-sm !border-[#C68E17] border-transparent disabled:bg-transparent disabled:text-black disabled:opacity-100" disabled size="large" />
                        </Form.Item>
                        <Form.Item name="calfSize" label={t("Around Calf")}>
                            <Input className="!rounded-none border-sm !border-[#C68E17] border-transparent disabled:bg-transparent disabled:text-black disabled:opacity-100" disabled size="large" />
                        </Form.Item>

                        <Form.Item name="shirtLengthSize" label={t("Shirt Length")}>
                            <Input className="!rounded-none border-sm !border-[#C68E17] border-transparent disabled:bg-transparent disabled:text-black disabled:opacity-100" disabled size="large" />
                        </Form.Item>
                        <Form.Item name="pantsLengthSize" label={t("Shalwar Length")}>
                            <Input className="!rounded-none border-sm !border-[#C68E17] border-transparent disabled:bg-transparent disabled:text-black disabled:opacity-100" disabled size="large" />
                        </Form.Item>

                    </div>
                    <Form.Item name="otherDetails" label={t("Other Details")}>
                        <TextArea className="!rounded-none border-sm !border-[#C68E17] border-transparent disabled:bg-transparent disabled:text-black disabled:opacity-100" size="large" />
                    </Form.Item>

                </Form>

                <div className="md:w-[30%] flex items-left p-2 items-center">
                    <Image preview={true} src={womenImg} className="w-full " alt="" />
                </div>
            </div>
        </Modal>

    )
}

export const MenModal = () => {
    const { t } = useTranslation('sizing');
    const [menForm] = Form.useForm();
    const dispatch = useDispatch();
    const modalSlice = useSelector((res) => res.modalSlice);
    modalSlice.menModalData && menForm.setFieldsValue(modalSlice.menModalData);
    return (
        <Modal
            open={modalSlice.menModal}
            onCancel={() => dispatch(resetModal())}
            footer={null}
            title={null}       // hide default title
            closable={false}
            bodyStyle={{ padding: 0 }}
            className="!w-[95%] md:!w-[60%]"
        >
            <div className="bg-[#C68E17] text-white font-bold text-lg px-6 py-4 flex justify-between items-center rounded-t-[4px]">
                {t(`Men Custom Stitched ${modalSlice.menModalData?.productName}`)}
                <button
                    onClick={() => dispatch(resetModal())}
                    className="text-white hover:text-gray-200 text-xl font-bold"
                >
                    ×
                </button>
            </div>
            <div className="grid md:grid-cols-3 gap-3">
                <div className="md:col-span-2">
                    <Form form={menForm} disabled={true} layout="vertical">
                        <div className="grid md:grid-cols-3 grid-cols-2 gap-x-1">
                            <Form.Item name="heightSize" label="Height">
                                <Input disabled
                                    className="!rounded-none border-sm !border-[#C68E17] border-transparent disabled:bg-transparent disabled:text-black disabled:opacity-100" size="large" />
                            </Form.Item>
                            <Form.Item name="shoulderSize" label="Shoulder">
                                <Input disabled
                                    className="!rounded-none border-sm !border-[#C68E17] border-transparent disabled:bg-transparent disabled:text-black disabled:opacity-100" size="large" />
                            </Form.Item>
                            <Form.Item name="sleeveSize" label="Sleeve Length">
                                <Input disabled
                                    className="!rounded-none border-sm !border-[#C68E17] border-transparent disabled:bg-transparent disabled:text-black disabled:opacity-100" size="large" />
                            </Form.Item>
                            <Form.Item name="collarSize" label="Collar">
                                <Input disabled
                                    className="!rounded-none border-sm !border-[#C68E17] border-transparent disabled:bg-transparent disabled:text-black disabled:opacity-100" size="large" />
                            </Form.Item>
                            <Form.Item name="bustSize" label="Bust">
                                <Input disabled
                                    className="!rounded-none border-sm !border-[#C68E17] border-transparent disabled:bg-transparent disabled:text-black disabled:opacity-100" size="large" />
                            </Form.Item>
                            <Form.Item name="waistSize" label={t("Around Waist")}>
                                <Input className="!rounded-none border-sm !border-[#C68E17] border-transparent disabled:bg-transparent disabled:text-black disabled:opacity-100" disabled size="large" />
                            </Form.Item>
                            <Form.Item name="hipsSize" label={t("Around Hips")}>
                                <Input className="!rounded-none border-sm !border-[#C68E17] border-transparent disabled:bg-transparent disabled:text-black disabled:opacity-100" disabled size="large" />
                            </Form.Item>
                            <Form.Item name="armholeSize" label="Arm Hole">
                                <Input disabled
                                    className="!rounded-none border-sm !border-[#C68E17] border-transparent disabled:bg-transparent disabled:text-black disabled:opacity-100" size="large" />
                            </Form.Item>
                            <Form.Item name="skirtSize" label="Skirt/daman">
                                <Input disabled
                                    className="!rounded-none border-sm !border-[#C68E17] border-transparent disabled:bg-transparent disabled:text-black disabled:opacity-100" size="large" />
                            </Form.Item>
                            <Form.Item name="pantsSize" label="Pants/Tunban">
                                <Input disabled
                                    className="!rounded-none border-sm !border-[#C68E17] border-transparent disabled:bg-transparent disabled:text-black disabled:opacity-100" size="large" />
                            </Form.Item>
                            <Form.Item name="ancleSize" label="Ancle/Pacha">
                                <Input disabled
                                    className="!rounded-none border-sm !border-[#C68E17] border-transparent disabled:bg-transparent disabled:text-black disabled:opacity-100" size="large" />
                            </Form.Item>


                        </div>
                        <Form.Item name="otherDetails" label="Other Details">
                            <TextArea disabled
                                className="!rounded-none border-sm !border-[#C68E17] border-transparent disabled:bg-transparent disabled:text-black disabled:opacity-100" size="large" />
                        </Form.Item>
                    </Form>
                </div>

                <div >
                    <Image preview={true} src={menImg} className="w-full" alt="men-img" />
                </div>
            </div>


        </Modal>
    )
}