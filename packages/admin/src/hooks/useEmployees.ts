import { useState, useCallback } from 'react';
import { DEMO_EMPLOYEES } from '../data/demoData';
import type { Employee } from '@rco/shared';

export function useEmployees() {
  const [employees, setEmployees] = useState<Employee[]>(DEMO_EMPLOYEES);
  const [loading] = useState(false);

  const addEmployee = useCallback(
    async (data: Partial<Employee>, _photo?: File) => {
      const id = `emp-${Date.now()}`;
      const newEmp: Employee = {
        id,
        firstName: data.firstName || '',
        lastName: data.lastName || '',
        displayName: `${data.firstName || ''} ${data.lastName || ''}`.trim(),
        email: data.email || '',
        department: data.department || '',
        employeeId: data.employeeId || '',
        phoneLast4: data.phoneLast4 || '',
        photoUrl: null,
        photoStatus: 'none',
        birthMonth: data.birthMonth || 0,
        birthDay: data.birthDay || 0,
        hireDate: data.hireDate || null,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        updatedBy: 'demo',
      };
      setEmployees((prev) => [...prev, newEmp]);
      console.log('[Demo] Added employee:', newEmp.displayName);
      return id;
    },
    []
  );

  const updateEmployee = useCallback(
    async (id: string, data: Partial<Employee>, _photo?: File) => {
      setEmployees((prev) =>
        prev.map((e) => (e.id === id ? { ...e, ...data, updatedAt: new Date().toISOString() } : e))
      );
      console.log('[Demo] Updated employee:', id);
    },
    []
  );

  const deleteEmployee = useCallback(async (id: string) => {
    setEmployees((prev) => prev.filter((e) => e.id !== id));
    console.log('[Demo] Deleted employee:', id);
  }, []);

  const toggleActive = useCallback(
    async (id: string, isActive: boolean) => {
      setEmployees((prev) =>
        prev.map((e) => (e.id === id ? { ...e, isActive } : e))
      );
      console.log('[Demo] Toggled employee:', id, 'active:', isActive);
    },
    []
  );

  return { employees, loading, addEmployee, updateEmployee, deleteEmployee, toggleActive };
}
