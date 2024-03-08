CREATE TABLE residents (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    firstName VARCHAR(255) NOT NULL,
    lastName VARCHAR(255) NOT NULL,
    middlename VARCHAR(255) NOT NULL,
    birthdate DATE NOT NULL,
    parentcontactnumber VARCHAR(20),
    role VARCHAR(20) NOT NULL
);

-- CREATE TABLE request_documents (
--     id INT AUTO_INCREMENT PRIMARY KEY,
--     resident_id INT,
--     document_type VARCHAR(255),
--     reason TEXT,
--     is_confirmed BOOLEAN DEFAULT 0,
--     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--     FOREIGN KEY (resident_id) REFERENCES residents(id)
-- );
-- UNCONFIRMED DEFAULT VALUE 

CREATE TABLE request_documents (
    id INT AUTO_INCREMENT PRIMARY KEY,
    resident_id INT,
    document_type VARCHAR(255),
    reason TEXT,
    is_confirmed VARCHAR(12) DEFAULT 'unconfirmed',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (resident_id) REFERENCES residents(id)
);
-- UPDATED --
-- FEB 10 --
-- currently using this one --
CREATE TABLE request_documents (
    id INT AUTO_INCREMENT PRIMARY KEY,
    resident_id INT,
    FullName VARCHAR(765), -- Adjust the length as per your requirement
    document_type VARCHAR(255),
    reason TEXT,
    is_confirmed VARCHAR(12) DEFAULT 'unconfirmed',
    requested_at VARCHAR(255),
    Payment VARCHAR(50) DEFAULT 'Pending',
    Paid_at VARCHAR(255) DEFAULT NULL,
    Cancel_payment_at VARCHAR(255),
    visibility_flag VARCHAR(255) DEFAULT 'default',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (resident_id) REFERENCES residents(id)
);


-- SO that the visibility will only be seen to those i want to see it --
-- peace baka Kazuha yarn HAHAHAHA --

ALTER TABLE request_documents
ADD COLUMN visibility_flag VARCHAR(255) DEFAULT 'default';

-- FEB CONCAT FOR THE FULLNAME MWEHEHEHE --

UPDATE request_documents rd
JOIN residents r ON rd.resident_id = r.id
SET rd.FullName = CONCAT(r.firstName, ' ',  r.lastName, ' ',r.middleName);


-- CHAT ROOM --
CREATE TABLE Chatrooms (
    id INT AUTO_INCREMENT PRIMARY KEY,
    chat_code VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- FOR NOTIFICATION --

-- ALTER TABLE request_documents ADD COLUMN confirm_by_president BOOLEAN DEFAULT NULL;
ALTER TABLE request_documents MODIFY COLUMN confirm_by_president VARCHAR(255) DEFAULT NULL;

