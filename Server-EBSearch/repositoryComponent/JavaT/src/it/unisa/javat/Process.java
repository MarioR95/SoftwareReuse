package it.unisa.javat;

import java.io.File;
import java.util.List;

import it.unisa.javat.Parameters;
import it.unisa.javat.Parser;
import it.unisa.javat.Constants;
import it.unisa.javat.Utils;
import it.unisa.javat.VersionBuild;
import it.unisa.javat.Process;

public class Process {

	private Parameters _params;	
	private Project _project;
	private Parser _parser;	
	
	public Process(String[] args) {
		try {
			Info(true);

			_params = new Parameters(args, this.getClass().getName());
			_params.print();

			_project = new Project(_params.getProjectPath(),_params.getOutputPath());
			_project.print();
						
			List<String> files = _project.getSourceFiles();
			for(String s: files) {
				Utils.print("Source file:"+s);
			}

			_parser = new Parser(_params.getJavaVersion());
			_parser.addClasspath(_project.getSourcePath());
			_parser.addClasspaths(_project.getBinaryPath());
			_parser.addClasspaths(_project.getLibraryPath());
			_parser.print();
			
			for (String s : files) {
				try {	
							_parser.compile(_project.getProjectPath(), _project.getProjectName(), _project.getSourcePath(), s);
							_parser.parse(_project.getProjectPath(), _project.getProjectName(), _project.getSourcePath(), s, _params.getOutputPath());
							//break;
						
				} catch (LocalException e) {
					Utils.print(e);
				}			
			}	
			
			Info(false);
		} catch (LocalException e) {
			Utils.print(e);
			System.exit(1);
		}
	}	
	
	private void Info(boolean start) throws LocalException {
		if(start) {
			String version = Constants.version + "." + VersionBuild.buildnum;
			Utils.print("*** " + Constants.appName + " ***");
			Utils.print("*** " + Constants.appAcro + " " +version+ " "+VersionBuild.builddate+" ***");
			Utils.print("*** " + Constants.authors + " ***");
		} else {
			Utils.print("*** End " + Constants.appAcro + " ***");
		}
	}	
	
	public static void main(String[] args) {
		new Process(args);
		System.exit(0);

	}

}
