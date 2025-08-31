
## Recovery & Cleanup

The project includes a backup and cleanup script for maintenance. When changes are made, a snapshot of the project can be taken and stored in the `.archive/` folder with a timestamp. This ensures there is no data loss, and the project can be rolled back easily.

### How to Roll Back
To roll back, decompress the desired ZIP archive from `.archive/` back into the project root.

