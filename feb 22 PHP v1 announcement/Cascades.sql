-- use this to be able to delete --
ALTER TABLE request_documents
ADD CONSTRAINT fk_resident_id
FOREIGN KEY (resident_id)
REFERENCES residents(id)
ON DELETE CASCADE;

-- use this to be able to delete the resident only and not the request_documents data --
ALTER TABLE request_documents
DROP FOREIGN KEY IF EXISTS fk_resident_id;

ALTER TABLE request_documents
ADD CONSTRAINT fk_resident_id
FOREIGN KEY (resident_id)
REFERENCES residents(id)
ON DELETE SET NULL;

-- i suggest to used this one

UPDATE request_documents
SET resident_id = NULL
WHERE resident_id IS NOT NULL
AND resident_id NOT IN (SELECT id FROM residents);



-- if you want to keep the id of the resident in the request_documents after the deletion you must use this --

-- ALTER TABLE request_documents
-- ADD CONSTRAINT fk_resident_id
-- FOREIGN KEY (resident_id)
-- REFERENCES residents(id)
-- ON DELETE NO ACTION;

CREATE TRIGGER update_fullname AFTER INSERT ON request_documents
FOR EACH ROW
BEGIN
    UPDATE request_documents rd
    JOIN residents r ON rd.resident_id = r.id
    SET rd.FullName = CONCAT(r.firstName, ' ',  r.lastName, ' ',r.middleName)
    WHERE rd.id = NEW.id;
END;

-- UPDATING THE FULL NAME EVERY INSERTION UWU HAHAHA -------------
-- BAKA procedure yarn --
DELIMITER //

CREATE TRIGGER update_fullname BEFORE INSERT ON request_documents
FOR EACH ROW
BEGIN
    DECLARE fname VARCHAR(255);
    DECLARE lname VARCHAR(255);
    DECLARE mname VARCHAR(255);
    
    -- Get the resident's information
    SELECT firstName, lastName, middlename
    INTO fname, lname, mname
    FROM residents
    WHERE id = NEW.resident_id;

    -- Update the FullName column of the inserted row
    SET NEW.FullName = CONCAT(fname, ' ', lname, ' ', mname);
END//

DELIMITER ;



