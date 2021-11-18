await db.query(`DELETE FROM prm."PR_RELEASE_STRATEGY"
WHERE "PR_NO"=${data.data[0].HEADER.PR_NO};`);