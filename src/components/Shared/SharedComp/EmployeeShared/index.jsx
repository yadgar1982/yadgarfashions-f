import { useEffect, useState } from "react";
import { Form, Input, Button, Switch, Select, Card, Modal, Table, Popconfirm } from "antd";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { http, formatDate, fetchData } from "../../../../../module/http";
import { toast } from "react-toastify";
import Cookies from "universal-cookie";
const cookies = new Cookies();
const { Item } = Form;
import useSWR, { mutate } from 'swr';

const EmployeeShared = () => {
    // get token from cookies
    const token = cookies.get("authToken");
    // Form related variable
    const [employeeForm] = Form.useForm();
    // states collection
    const [employees, setemployees] = useState([]);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 5,
        total: 0,
    });
    const [loading, setLoading] = useState(false);
    const [delLoading, setDelLoading] = useState(false);
    const [employeeModal, setemployeeModal] = useState(false);
    const [no, setNo] = useState(0);
    const [edit, setEdit] = useState(null);
    const [loaderIndex, setLoaderIndex] = useState(0);

    // fetch all employees
    const fetchemployees = async (page = 1, pageSize = 10) => {
        setLoading(true);
        try {
            const httpReq = http(token);
            const response = await httpReq.get(`/api/employee/pagination?page=${page}&limit=${pageSize}`);
            const { data, total } = response.data;
            setemployees(data);
            setPagination({
                current: page,
                pageSize: pageSize,
                total: total,
            });
        } catch (error) {
            console.error('Error fetching employees:', error);
        } finally {
            setLoading(false);
        }
    };

    // calling fetchemployees function
    useEffect(() => {
        fetchemployees(pagination.current, pagination.pageSize);
    }, [no]);

    // calling fetchemployees on table
    const handleTableChange = (pagination) => {
        fetchemployees(pagination.current, pagination.pageSize);
    };

    // fetch countries data from api
    const { data: country, error: currError } = useSWR(
        `/api/currency/all`,
        fetchData,
        {
            revalidateOnFocus: false,
            revalidateOnReconnect: false,
            refreshInterval: 1200000,
        }
    );

    // Register new employee
    const onFinish = async (values) => {
        try {
            setLoading(true);
            values.employeePassword = "Employee123@"
            const httpReq = http(token);
            await httpReq.post("/api/employee/create", values);
            toast.success("Employee created successfully");
            setemployeeModal(false);
            employeeForm.resetFields();
            setNo(no + 1);
        } catch (err) {
            console.log(err);
            if (err.status === 400) {
                toast.error("This employee already registered !");
            } else {
                toast.error(err?.response?.data?.message);
            }
        } finally {
            setLoading(false);
        }
    }

    // update is active 
    const updateemployeeStatus = async (id, status, index) => {
        try {
            let obj = { status: !status };
            const httpReq = http(token);
            const { data } = await httpReq.put(`/api/employee/status/${id}`, obj);
            const updatedList = [...employees];
            updatedList.splice(index, 1, data?.employee);
            setemployees(updatedList);
            toast.success("Updated employee status !");
        } catch (err) {
            toast.error("Unable to update employee status !");
        }
    }

    // delete employee
    const deleteemployee = async (id, index) => {
        try {
            setDelLoading(true);
            setLoaderIndex(index);
            const httpReq = http(token);
            await httpReq.delete(`/api/employee/delete/${id}`);
            // remove the deleted item from state
            const updatedList = [...employees];
            updatedList.splice(index, 1);
            setemployees(updatedList);
            toast.success("employee deleted successfully");
        } catch (error) {
            toast.error("Failed to delete employee");
        } finally {
            setDelLoading(false);
        }
    };

    // on edit employees 
    const onEditemployee = (obj, index) => {
        setemployeeModal(true);
        employeeForm.setFieldsValue(obj);
        setEdit(obj);
        setLoaderIndex(index);
    }

    // on update employees
    const onUpdateemployee = async (values) => {
        try {
            setLoading(true);
            const httpReq = http(token);
            const { data } = await httpReq.put(`/api/employee/update/${edit?._id}`, values);
            // remove the deleted item from state
            const updatedList = [...employees];
            updatedList.splice(loaderIndex, 1, data?.employee);
            setemployees(updatedList);
            toast.success("Updated employee Info !");
            setemployeeModal(false);
            setEdit(null);
            employeeForm.resetFields();
        } catch (err) {
            toast.error("Unable to update employee Info !");
        } finally {
            setLoading(false);
        }
    }

    // employee model close reset form
    const onemployeeModalClose = () => {
        setemployeeModal(false);
        setEdit(null);
        employeeForm.resetFields();
    }

    // colums for employees list
    const columns = [
        {
            title: 'Sr no',
            key: 'srNo',
            render: (x, y, index) => (index + 1)
        },
        {
            title: 'Employee Name',
            dataIndex: 'employeeName',
            key: 'employeeName',
        },
        {
            title: 'Employee Email',
            dataIndex: 'employeeEmail',
            key: 'employeeEmail',
        },
        {
            title: 'Employee Salary',
            dataIndex: 'employeeSalary',
            key: 'employeeSalary',
        },
        {
            title: 'Employee Mobile',
            dataIndex: 'employeeMobile',
            key: 'employeeMobile',
        },
        {
            title: 'Employee Country',
            dataIndex: 'employeeCountry',
            key: 'employeeCountry',
        },
        {
            title: 'Employee Address',
            dataIndex: 'employeeAddress',
            key: 'employeeAddress',
        },
        {
            title: 'CreatedAt',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (d) => formatDate(d)
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            fixed: "right",
            render: (x, obj, index) => (
                <Switch
                    checkedChildren="ACTIVATE"
                    unCheckedChildren="DEACTIVATE"
                    defaultChecked={obj.status}
                    onChange={() => updateemployeeStatus(obj?._id, obj?.status, index)}
                />
            )
        },
        {
            title: 'Action',
            dataIndex: 'action',
            key: 'action',
            fixed: "right",
            render: (_, obj, index) => (
                <div
                    className="flex items-center gap-2"
                >
                    <Button
                        loading={index === loaderIndex && loading}
                        type="text"
                        shape="circle"
                        className="!bg-indigo-500 !text-white"
                        icon={<EditOutlined />}
                        onClick={() => onEditemployee(obj, index)}
                    />
                    <Popconfirm
                        title="Do you wanna delete employee?"
                        icon={<DeleteOutlined />}
                        onCancel={() => toast.info("Your employees is safe !")}
                        onConfirm={() => deleteemployee(obj?._id, index)}
                    >
                        <Button
                            loading={index === loaderIndex && delLoading}
                            type="text"
                            shape="circle"
                            className="!bg-rose-500 !text-white"
                            icon={<DeleteOutlined />}
                        />
                    </Popconfirm>
                </div>
            )
        },
    ];

    return (
        <div>
            <Card
                title="Employee List"
                className="shadow-md"
                style={{ overflowX: "auto", fontSize: "20px", fontWeight: "600" }}
                extra={
                    <Button
                        className="!bg-blue-500 !text-white !font-bold"
                        type="text" icon={<PlusOutlined />}
                        onClick={() => setemployeeModal(true)}
                    >
                        Add new employee
                    </Button>
                }
            >
                <Table
                    columns={columns}
                    dataSource={employees}
                    rowKey="_id"
                    loading={loading}
                    pagination={pagination}
                    onChange={handleTableChange}
                    scroll={{ x: "max-content" }}
                    className="capitalize"
                />
            </Card>
            <Modal
                open={employeeModal}
                width={720}
                onCancel={onemployeeModalClose}
                title="Register a new employee"
                style={{ fontSize: "20px", fontWeight: "600" }}
                footer={null}
            >
                <Form
                    name="add-employee"
                    layout="vertical"
                    onFinish={edit ? onUpdateemployee : onFinish}
                    form={employeeForm}
                >
                    <div className="mt-5 grid md:grid-cols-2 gap-x-3">
                        <Item
                            label="Employee Name"
                            name="employeeName"
                            rules={[{ required: true }]}
                        >
                            <Input placeholder="e.g. Noor Zada" />
                        </Item>
                        <Item
                            label="Employee Email"
                            name="employeeEmail"
                            rules={[{ required: true }]}
                        >
                            <Input placeholder="e.g. Noor@gmail.com" />
                        </Item>
                    </div>
                    <div className="grid md:grid-cols-3 gap-x-3">
                        <Item
                            label="Employee Salary"
                            name="employeeSalary"
                            rules={[{ required: true }]}
                        >
                            <Input type="number" placeholder="e.g. 6393640841" />
                        </Item>
                        <Item
                            label="Employee Mobile"
                            name="employeeMobile"
                            rules={[{ required: true }]}
                        >
                            <Input type="number" placeholder="e.g. 6393640841" />
                        </Item>
                        <Item
                            label="Country"
                            name="employeeCountry"
                            rules={[{ required: true }]}
                        >

                            <Select
                                className="min-w-[100px] uppercase" placeholder="Select Country"
                            >
                                {
                                    country && country.map((item) => (
                                        <Option key={item.countryName} value={item.countryName}>
                                            {item.countryName}
                                        </Option>
                                    ))
                                }
                            </Select>
                        </Item>
                    </div>
                    <Item
                        label="Employee Address"
                        name="employeeAddress"
                        rules={[{ required: true }]}
                    >
                        <Input.TextArea placeholder="e.g. Delhi, India" rows={3} />
                    </Item>

                    <div align="end">
                        <Item>
                            {
                                edit ?
                                    <Button
                                        type="text"
                                        htmlType="submit"
                                        loading={loading}
                                        className="!font-bold !bg-rose-500 !text-white !hover:bg-blue-600"
                                    >
                                        Update employee
                                    </Button>
                                    :
                                    <Button
                                        type="text"
                                        htmlType="submit"
                                        loading={loading}
                                        className="!font-bold !bg-blue-500 !text-white !hover:bg-blue-600"
                                    >
                                        Register employee
                                    </Button>
                            }
                        </Item>
                    </div>
                </Form>
            </Modal>
        </div>
    );
};

export default EmployeeShared;
