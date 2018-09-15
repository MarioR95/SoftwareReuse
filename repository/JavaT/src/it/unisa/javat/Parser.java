package it.unisa.javat;

import java.io.File;
import java.io.IOException;
import java.util.List;
import java.util.Map;

import org.eclipse.jdt.core.JavaCore;
import org.eclipse.jdt.core.compiler.IProblem;
import org.eclipse.jdt.core.dom.AST;
import org.eclipse.jdt.core.dom.ASTNode;
import org.eclipse.jdt.core.dom.ASTParser;
import org.eclipse.jdt.core.dom.Block;
import org.eclipse.jdt.core.dom.CompilationUnit;
import org.eclipse.jdt.core.dom.FieldDeclaration;
import org.eclipse.jdt.core.dom.ImportDeclaration;
import org.eclipse.jdt.core.dom.MethodDeclaration;
import org.eclipse.jdt.core.dom.Modifier.ModifierKeyword;
import org.eclipse.jdt.core.dom.Modifier;
import org.eclipse.jdt.core.dom.Name;
import org.eclipse.jdt.core.dom.Statement;
import org.eclipse.jdt.core.dom.TypeDeclaration;
import org.eclipse.jdt.core.dom.VariableDeclarationFragment;
import org.eclipse.jdt.core.dom.rewrite.ASTRewrite;
import org.eclipse.jdt.core.dom.rewrite.ListRewrite;
import org.eclipse.jface.text.BadLocationException;
import org.eclipse.jface.text.Document;
import org.eclipse.text.edits.TextEdit;

import it.unisa.javat.LocalException;
import it.unisa.javat.visitor.ClassVisitor;
import it.unisa.javat.FileManager;
import it.unisa.javat.JarFilenameFilter;
import it.unisa.javat.Utils;

public class Parser {

	private String _javaVersion = JavaCore.VERSION_9;
	private String[] _classpath = new String[0];
	private String _classpathSeparator = System.getProperty("path.separator");
	private String _jreHome;

	public Parser(int javaVersion) {
		Utils.print("File parsing.");

		String javaClassPath = System.getProperty("java.class.path");
		if (javaClassPath != null && !javaClassPath.equals("")) {
			addClasspaths(javaClassPath.split(_classpathSeparator));
		}
		_jreHome = System.getProperty("java.home");
		if (_jreHome != null && !_jreHome.equals("")) {
			addClasspaths(_jreHome + File.separator + Constants.libraryPath);
		}

		switch (javaVersion) {
		case 1:
			_javaVersion = JavaCore.VERSION_1_1;
			break;
		case 2:
			_javaVersion = JavaCore.VERSION_1_2;
			break;
		case 3:
			_javaVersion = JavaCore.VERSION_1_3;
			break;
		case 4:
			_javaVersion = JavaCore.VERSION_1_4;
			break;
		case 5:
			_javaVersion = JavaCore.VERSION_1_5;
			break;
		case 6:
			_javaVersion = JavaCore.VERSION_1_6;
			break;
		case 7:
			_javaVersion = JavaCore.VERSION_1_7;
			break;
		case 8:
			_javaVersion = JavaCore.VERSION_1_8;
			break;
		case 9:
			_javaVersion = JavaCore.VERSION_9;
			break;
		default:
			_javaVersion = JavaCore.VERSION_9;
			break;
		}
	}

	public void addClasspath(String path) {
		if (FileManager.fileExists(path) || FileManager.directoryExists(path)) {
			String[] nClasspath = new String[_classpath.length + 1];
			System.arraycopy(_classpath, 0, nClasspath, 0, _classpath.length);
			nClasspath[_classpath.length] = new File(path).getAbsolutePath();
			_classpath = new String[nClasspath.length];
			System.arraycopy(nClasspath, 0, _classpath, 0, nClasspath.length);
		}
	}

	public void addClasspaths(String[] paths) {
		for (String path : paths) {
			addClasspath(path);
		}
	}

	public void addClasspaths(String path) {
		if (FileManager.directoryExists(path)) {
			File[] dirContents = new File(path).listFiles(new JarFilenameFilter());
			String[] nClasspath = new String[_classpath.length + dirContents.length];
			System.arraycopy(_classpath, 0, nClasspath, 0, _classpath.length);

			int i = 0;
			for (File f : dirContents) {
				nClasspath[_classpath.length + (i++)] = f.getAbsolutePath();
			}

			_classpath = new String[nClasspath.length];
			System.arraycopy(nClasspath, 0, _classpath, 0, nClasspath.length);

			addClasspath(path);
		}
	}

	public String getClasspath(boolean print) {
		StringBuilder sb = new StringBuilder();
		for (int i = 0; i < _classpath.length; i++) {
			if (i == (_classpath.length - 1))
				sb.append(_classpath[i]);
			else {
				sb.append(_classpath[i] + _classpathSeparator);
				if (print) {
					sb.append("\n");
				}

			}
		}
		return sb.toString();
	}

	public void print() {
		Utils.print("Classpath.");
		Utils.print(this.getClasspath(true));
	}

	public void compile(String projectPath, String project, String filePath, String fileName) throws LocalException {

		Utils.print("Compiling file:" + fileName);
		try {
			String str = FileManager.readFileToString(filePath + File.separator + fileName);

			ASTParser parser = ASTParser.newParser(AST.JLS9);
			parser.setSource(str.toCharArray());

			parser.setKind(ASTParser.K_COMPILATION_UNIT);
			parser.setUnitName(project + File.separator + fileName);
			parser.setEnvironment(_classpath, new String[] { filePath }, new String[] { "UTF8" }, true);

			Map<String, String> options = JavaCore.getOptions();
			JavaCore.setComplianceOptions(_javaVersion, options);
			parser.setCompilerOptions(options);

			final CompilationUnit compilation = (CompilationUnit) parser.createAST(null);

			IProblem[] problems = compilation.getProblems();
			for (IProblem problem : problems) {
				String problemFormat = problem.toString();
				Utils.print(problemFormat);
			}

		} catch (IOException ioe) {
			throw new LocalException("Error compiling file '" + fileName + "': " + ioe.getMessage());
		}
	}

	public void parse(String projectPath, String project, String filePath, String fileName, String outputPath) throws LocalException {

		Utils.print("Parsing file:" + fileName);
		try {
			String str = FileManager.readFileToString(filePath + File.separator + fileName);

			ASTParser parser = ASTParser.newParser(AST.JLS9);
			parser.setSource(str.toCharArray());

			parser.setResolveBindings(true);
			parser.setBindingsRecovery(true);

			parser.setKind(ASTParser.K_COMPILATION_UNIT);
			parser.setUnitName(project + File.separator + fileName);
			parser.setEnvironment(_classpath, new String[] { filePath }, new String[] { "UTF8" }, true);

			Map<String, String> options = JavaCore.getOptions();
			JavaCore.setComplianceOptions(_javaVersion, options);
			parser.setCompilerOptions(options);

			Document document = new Document(str);

			final CompilationUnit compilation = (CompilationUnit) parser.createAST(null);

			AST ast = compilation.getAST();
			ASTRewrite rewriter = ASTRewrite.create(ast);
			compilation.recordModifications();

			ClassVisitor visitor0 = new ClassVisitor(compilation, document, rewriter);
			compilation.accept(visitor0);

			//ListRewrite listRewrite;
			//Block block;
			//Statement statement;

			// Add a new import
			//ImportDeclaration id = ast.newImportDeclaration();
			//id.setName(ast.newName(new String[] { "it", "unisa", "PComponent" }));
			//listRewrite = rewriter.getListRewrite(compilation, CompilationUnit.IMPORTS_PROPERTY);
			//listRewrite.insertLast(id, null);

			// Change a specific import

			//@SuppressWarnings("unchecked")
			//List<ImportDeclaration> imports = compilation.imports();
			//for (ImportDeclaration i : imports) {
			//	Name oldImport = i.getName();
			//	if (oldImport.getFullyQualifiedName().endsWith(".JButton")) {
			//		Name newImport = ast.newName(new String[] { "it", "unisa", "PButton" });
			//		rewriter.replace(oldImport, newImport, null);
			//	}
			//}

			//TypeDeclaration type = (TypeDeclaration) compilation.types().get(0);

			// Add a new field variable
			//VariableDeclarationFragment fragment = ast.newVariableDeclarationFragment();
			//fragment.setName(ast.newSimpleName("mainFrame"));
			//fragment.setInitializer(ast.newNullLiteral());

			//FieldDeclaration fieldDeclaration = ast.newFieldDeclaration(fragment);

			//fieldDeclaration.setType(ast.newSimpleType(ast.newSimpleName("pComponent")));

			//@SuppressWarnings("unchecked")
			//List<Modifier> fieldModifiers = fieldDeclaration.modifiers();
			//fieldModifiers.add(ast.newModifier(ModifierKeyword.PRIVATE_KEYWORD));
			//listRewrite = rewriter.getListRewrite(type, TypeDeclaration.BODY_DECLARATIONS_PROPERTY);
			//listRewrite.insertFirst(fieldDeclaration, null);

			// Add a new method
			//MethodDeclaration methodDeclaration = ast.newMethodDeclaration();
			//methodDeclaration.setConstructor(false);

			//@SuppressWarnings("unchecked")
			//List<Modifier> methodModifiers = methodDeclaration.modifiers();
			//methodModifiers.add(ast.newModifier(ModifierKeyword.PUBLIC_KEYWORD));

			//methodDeclaration.setName(ast.newSimpleName("getTopComponent"));
			//methodDeclaration.setReturnType2(ast.newSimpleType(ast.newSimpleName("pComponent")));
			//block = ast.newBlock();

			//listRewrite = rewriter.getListRewrite(block, Block.STATEMENTS_PROPERTY);
			//statement = (Statement) rewriter.createStringPlaceholder("//Do not remove!", ASTNode.EMPTY_STATEMENT);
			//listRewrite.insertLast(statement, null);

			//listRewrite = rewriter.getListRewrite(block, Block.STATEMENTS_PROPERTY);
			//statement = (Statement) rewriter.createStringPlaceholder("return mainFrame;", ASTNode.RETURN_STATEMENT);
			//listRewrite.insertLast(statement, null);

			//methodDeclaration.setBody(block);

			//listRewrite = rewriter.getListRewrite(type, TypeDeclaration.BODY_DECLARATIONS_PROPERTY);
			//listRewrite.insertLast(methodDeclaration, null);

			//try {
			//	TextEdit edits = rewriter.rewriteAST(document, null);
			//	edits.apply(document);

			//	String writeFilePath = outputPath + File.separator + project + File.separator + fileName;
			//	String writeDirectoryPath = writeFilePath.substring(0, writeFilePath.lastIndexOf(File.separator));
			//	FileManager.writeDirectory(writeDirectoryPath);
			//	FileManager.writeFile(writeFilePath, document.get());

			//} catch (BadLocationException ble) {

			//}
		} catch (IOException ioe) {
			throw new LocalException("Error parsing file '" + fileName + "': " + ioe.getMessage());
		}
	}
}
