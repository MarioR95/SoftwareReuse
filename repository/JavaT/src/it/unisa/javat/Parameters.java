package it.unisa.javat;

import argparser.ArgParser;
import argparser.BooleanHolder;
import argparser.IntHolder;
import argparser.StringHolder;

public class Parameters {

	StringHolder _path = new StringHolder();
	StringHolder _outpath = new StringHolder();
	IntHolder _java = new IntHolder();
	BooleanHolder _debug = new BooleanHolder();
	
	ArgParser parser = new ArgParser("");

	public Parameters(String[] args, String name) throws LocalException {
		init();
		
		parser.setSynopsisString("java "+name+" -path <string> <options>");
		
		parser.addOption("-path %s #Java project source path", _path);
		parser.addOption("-out %s #Output path", _outpath);		
		parser.addOption("-java %d {[1,9]} #Java compiler version", _java);
		parser.addOption("-debug %v #enables display of debugging info", _debug);

		parser.matchAllArgs(args);	

		if(_path.value == null) {
			throw new LocalException("Project source path parameter is required.");
		}
		if(_outpath.value == null) {
			throw new LocalException("Output path parameter is required.");
		}		
	}
	
	private void init() {
		_java.value = 9;
		_debug.value = false;
	}
	
	
	public boolean isDebug() {
		return _debug.value;
	}
	
	public String getProjectPath() {
		return _path.value;
	}	
	
	public String getOutputPath() {
		return _outpath.value;
	}
	
	public int getJavaVersion() {
		return _java.value;
	}	
	
	public void print() {
		Utils.print("Parameters.");
		Utils.print("path = " + _path.value);
		Utils.print("output path = " + _outpath.value);
		Utils.print("java = " + _java.value);
		Utils.print("debug = " + _debug.value);
	}
	
	public void usage() {
		Utils.print(parser.getHelpMessage());
	}
	
	
}
