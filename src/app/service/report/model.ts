export interface DebtReport {
    companyId: number;
    companyName: string;
    customerName: string;
    totalDue: number;
    totalPaid: number;
    current: number;
    days30: number;
    days60: number;
    statusId: number;
    statusDescription: string;
    escalationDate: Date;
}

export interface DebtCompanies {
    companyId: number;
    companyName: string;
}

// {"companyId":1,"companyName":"Bizonic Investments (Pty) Ltd","customerName":"Excel Component Manufacturing (Pty) Ltd","totalDue":7065,"totalPaid":2715,"current":3780,"days30":4230,"days60":1770,"statusId":1,"statusDescription":"Legal","escalationDate":"2021-03-04T00:00:00"}