import os

def copy_directory(source, destination):
    try:
        # Check if the source directory exists
        if os.path.exists(source):
            # Extracting the directory name from the source path
            directory_name = os.path.basename(source)
            # Constructing the destination path with the directory name
            destination_with_dirname = os.path.join(destination, directory_name)
            
            # Constructing the shell command to copy the directory and its contents
            command = f"xcopy /E /I /Y \"{source}\" \"{destination_with_dirname}\""
            # Using os.system to execute the command
            os.system(command)
            
            print(f"Directory '{source}' copied to '{destination_with_dirname}' successfully.")
        else:
            print(f"Source directory '{source}' does not exist.")
    except Exception as e:
        print(f"Error: {e}")

# Example usage:
source_directory = "C:\\Users\\SUPERUSER\\Desktop\\Survey's\\hh_10-04-2024-00-03-34"
destination_directory = "C:\\Users\\SUPERUSER\\Desktop\\BDS V35.2\\Backup\\"
copy_directory(source_directory, destination_directory)

def remove_directory(directory):
    try:
        # Constructing the shell command to remove the directory and its contents
        command = f"rmdir /s /q \"{directory}\""
        # Using os.system to execute the command
        os.system(command)
        print(f"Directory '{directory}' and its contents removed successfully.")
    except Exception as e:
        print(f"Error: {e}")

# Example usage:
directory_to_remove = "C:\\Users\\SUPERUSER\\Desktop\\Survey's\\"
remove_directory(directory_to_remove)
