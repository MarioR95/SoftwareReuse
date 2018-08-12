package it.unisa.javat.visitor;

import java.lang.reflect.Modifier;
import java.util.Iterator;
import java.util.List;
import java.util.Stack;

import org.eclipse.jdt.core.dom.ASTNode;
import org.eclipse.jdt.core.dom.ASTVisitor;
import org.eclipse.jdt.core.dom.AnonymousClassDeclaration;
import org.eclipse.jdt.core.dom.Block;
import org.eclipse.jdt.core.dom.ChildListPropertyDescriptor;
import org.eclipse.jdt.core.dom.ChildPropertyDescriptor;
import org.eclipse.jdt.core.dom.ClassInstanceCreation;
import org.eclipse.jdt.core.dom.Comment;
import org.eclipse.jdt.core.dom.CompilationUnit;
import org.eclipse.jdt.core.dom.EnumDeclaration;
import org.eclipse.jdt.core.dom.Expression;
import org.eclipse.jdt.core.dom.FieldDeclaration;
import org.eclipse.jdt.core.dom.IMethodBinding;
import org.eclipse.jdt.core.dom.IPackageBinding;
import org.eclipse.jdt.core.dom.ITypeBinding;
import org.eclipse.jdt.core.dom.ImportDeclaration;
import org.eclipse.jdt.core.dom.Initializer;
import org.eclipse.jdt.core.dom.MethodDeclaration;
import org.eclipse.jdt.core.dom.MethodInvocation;
import org.eclipse.jdt.core.dom.PackageDeclaration;
import org.eclipse.jdt.core.dom.SimplePropertyDescriptor;
import org.eclipse.jdt.core.dom.TypeDeclaration;
import org.eclipse.jdt.core.dom.VariableDeclarationFragment;
import org.eclipse.jdt.core.dom.VariableDeclarationStatement;
import org.eclipse.jdt.core.dom.rewrite.ASTRewrite;
import org.eclipse.jface.text.BadLocationException;
import org.eclipse.jface.text.Document;

import it.unisa.javat.Utils;

public class ClassVisitor extends ASTVisitor {

	CompilationUnit _compilation;
	Document _document;
	ASTRewrite _rewriter;
	Stack<Scope> _scope;

	public ClassVisitor(CompilationUnit compilation, Document document, ASTRewrite rewriter) {
		_compilation = compilation;
		_document = document;
		_rewriter = rewriter;

		_scope = new Stack<Scope>();
	}

	// Compilation Unit
	@Override
	public boolean visit(CompilationUnit node) {

		@SuppressWarnings("unchecked")
		List<Comment> comments = node.getCommentList();
		for (Comment c : comments) {
			try {
				String codeComment = _document.get(c.getStartPosition(), c.getLength());
				Utils.print("[CO " + codeComment + " ]CO");
			} catch (BadLocationException e) {
			}
		}
		_scope.push(new Scope(ScopeType.COMPILATIONUNIT));
		Utils.print("[CU " + node.getClass().getSimpleName());
		return true;
	}

	@Override
	public void endVisit(CompilationUnit node) {
		Utils.print(" ]CU");
		_scope.pop();
	}

	// Package Declaration
	@Override
	public boolean visit(PackageDeclaration node) {
		IPackageBinding binding = node.resolveBinding();
		if (binding == null) {
			Utils.print("[PD NOBIND]");
			return false;
		}
		Utils.print("  [PD " + node.getClass().getSimpleName() + " " + binding.getName() + " ]");
		return true;
	}

	@Override
	public void endVisit(PackageDeclaration node) {
		// Utils.print(" ]PD");
	}

	// Import Declaration
	@Override
	public boolean visit(ImportDeclaration node) {
		Utils.print("  [ID " + node.getClass().getSimpleName() + " " + node.getName() + " ]");
		return true;
	}

	@Override
	public void endVisit(ImportDeclaration node) {
		// Utils.print(" ]ID");
	}

	// Type Declaration
	@Override
	public boolean visit(TypeDeclaration node) {
		ITypeBinding binding = node.resolveBinding();
		if (binding == null) {
			Utils.print("[TD NOBIND]");
			return false;
		}

		if (binding.isInterface()) {
			Utils.print("  [TD" + printModifiers(binding.getModifiers()) + " INTERFACE " + node.getClass().getSimpleName() + " " + binding.getQualifiedName());
		} else
			Utils.print("  [TD" + printModifiers(binding.getModifiers()) + " " + node.getClass().getSimpleName() + " " + binding.getQualifiedName());

		ITypeBinding superclass = binding.getSuperclass();
		if (superclass != null) {
			Utils.print("   [EXT" + printModifiers(superclass.getModifiers()) + " " + superclass.getQualifiedName() + " ]");
		}

		ITypeBinding[] interfaces = binding.getInterfaces();
		for (ITypeBinding sInterface : interfaces) {
			Utils.print("   [IMP" + printModifiers(sInterface.getModifiers()) + " " + sInterface.getQualifiedName() + " ]");
		}

		return true;
	}

	@Override
	public void endVisit(TypeDeclaration node) {
		Utils.print("  ]TD");
	}

	// Enum Declaration
	@Override
	public boolean visit(EnumDeclaration node) {
		ITypeBinding binding = node.resolveBinding();
		if (binding == null) {
			Utils.print("[ED NOBIND]");
			return false;
		}

		if (binding.isEnum()) {
			Utils.print("  [ED" + printModifiers(binding.getModifiers()) + " " + node.getClass().getSimpleName() + " " + binding.getQualifiedName());
		}

		return true;
	}

	@Override
	public void endVisit(EnumDeclaration node) {
		Utils.print("  ]ED");
	}

	// Anonymous Class Declaration
	@Override
	public boolean visit(AnonymousClassDeclaration node) {
		ITypeBinding binding = node.resolveBinding();
		if (binding == null) {
			Utils.print("[AD NOBIND]");
			return false;
		}

		if (binding.isAnonymous()) {
			Utils.print("  [AD" + printModifiers(binding.getModifiers()) + " " + node.getClass().getSimpleName() + " " + binding.getBinaryName());
		}

		return true;
	}

	@Override
	public void endVisit(AnonymousClassDeclaration node) {
		Utils.print("  ]AD");
	}

	// Method Declaration
	@Override
	public boolean visit(MethodDeclaration node) {
		IMethodBinding binding = node.resolveBinding();
		if (binding == null) {
			Utils.print("[MD NOBIND]");
			return false;
		}
		
		Utils.print("    [MD" + printModifiers(binding.getModifiers()) + " " + node.getClass().getSimpleName() + " " + binding.toString() + " ]");
		return true;
	}

	@Override
	public void endVisit(MethodDeclaration node) {
		// Utils.print(" ]MD");
	}

	// Field Declaration
	@Override
	public boolean visit(FieldDeclaration node) {
		Utils.print("    [FD " + node.getClass().getSimpleName() + " " + node.toString() + " ]");
		return true;
	}

	@Override
	public void endVisit(FieldDeclaration node) {
		// Utils.print(" ]FD");
	}

	// Method Invocation
	@Override
	public boolean visit(MethodInvocation node) {
		String methodInvoker = null;
		String classInvoker = null;

		MethodDeclaration mnode = getMethodDeclaration(node);
		if (mnode != null) {
			IMethodBinding mbinding = mnode.resolveBinding();
			if (mbinding != null) {
				classInvoker = mbinding.getDeclaringClass().getQualifiedName();
			}

			methodInvoker = mnode.getName().getFullyQualifiedName();
		} else
			methodInvoker = "STATIC";

		if (classInvoker == null) {
			TypeDeclaration tnode = getTypeDeclaration(node);
			if (tnode != null) {
				ITypeBinding tbinding = tnode.resolveBinding();
				if (tbinding != null) {
					classInvoker = tbinding.getQualifiedName();
				}

			}
		}
		IMethodBinding binding = node.resolveMethodBinding();
		if (binding == null) {
			Utils.print("      [MI " + node.getClass().getSimpleName() + " " + classInvoker + " " + methodInvoker + " -> " + node.toString() + " NOBIND]");
			return false;
		}

		Utils.print("      [MI " + node.getClass().getSimpleName() + " " + classInvoker + " " + methodInvoker + " -> "
				+ binding.getDeclaringClass().getQualifiedName() + " " + node.toString() + " ]");
		return true;
	}

	@Override
	public void endVisit(MethodInvocation node) {
		// Utils.print(" ]MI");
	}

	// Class Instance Creation
	@Override
	public boolean visit(ClassInstanceCreation node) {
		IMethodBinding binding = node.resolveConstructorBinding();
		if (binding == null) {
			Utils.print("[CIC NOBIND]");
			return false;
		}
		if (binding.isConstructor()) {
			if (this.isTypeDeclaration(binding.getDeclaringClass(), "javax.swing.JFrame")) {

				Utils.print("    [CIC " + node.getClass().getSimpleName() + " " + binding.getName() + " " + node + "]");
				ASTNode parent = node.getParent().getParent();
				if (parent instanceof VariableDeclarationStatement) {
					VariableDeclarationStatement vnode = (VariableDeclarationStatement) parent;
					List<?> fragments = vnode.fragments();
					Utils.print("" + vnode.toString());
				} else if (parent instanceof Block) {
					Block bnode = (Block) parent;
					List<?> fragments = bnode.statements();
					Utils.print("" + bnode.toString());
				}
			}
		}
		return true;
	}

	@Override
	public void endVisit(ClassInstanceCreation node) {
		// Utils.print(" ]CIC");
	}

	/*
	 * @Override public boolean visit(Assignment node) { AST ast = node.getAST();
	 * MethodInvocation setter = ast.newMethodInvocation();
	 * 
	 * setter.setName(ast.newSimpleName("setField"));
	 * 
	 * Expression expr = node.getRightHandSide(); Utils.print(">>>>>>>>>>>>>>>>>" +
	 * expr.toString());
	 * 
	 * setter.arguments().add(_rewriter.createMoveTarget(node.getRightHandSide()));
	 * _rewriter.replace(node, setter, null);
	 * 
	 * Utils.print(">>>>>>>>>>>>>>>>>" + node.toString()); return true; }
	 */

	/****/

	private String printModifiers(int mod) {
		String modifier = "";
		if (Modifier.isPublic(mod))
			modifier += " PUBLIC";
		if (Modifier.isProtected(mod))
			modifier += " PROTECTED";
		if (Modifier.isPrivate(mod))
			modifier += " PRIVATE";
		if (Modifier.isStatic(mod))
			modifier += " STATIC";
		if (Modifier.isInterface(mod))
			modifier += " INTERFACE";
		if (Modifier.isAbstract(mod))
			modifier += " ABSTRACT";
		return modifier;
	}

	private boolean isTypeDeclaration(ITypeBinding node, String className) {
		boolean found = false;
		if (node.getQualifiedName().equals(className)) {
			found = true;
		}

		if (!found) {
			ITypeBinding superclass = node.getSuperclass();
			if (superclass != null)
				if (isTypeDeclaration(superclass, className)) {
					found = true;
				}
		}

		if (!found) {
			ITypeBinding[] interfaces = node.getInterfaces();
			for (ITypeBinding sInterface : interfaces) {
				found = isTypeDeclaration(sInterface, className);
				if (found)
					break;
			}
		}
		return found;
	}

	private MethodDeclaration getMethodDeclaration(ASTNode node) {
		ASTNode pnode = node;
		while (pnode != null && pnode.getNodeType() != ASTNode.METHOD_DECLARATION) {
			pnode = pnode.getParent();
		}

		return (MethodDeclaration) pnode;
	}

	private TypeDeclaration getTypeDeclaration(ASTNode node) {
		ASTNode pnode = node;
		while (pnode != null && pnode.getNodeType() != ASTNode.TYPE_DECLARATION) {
			pnode = pnode.getParent();
		}

		return (TypeDeclaration) pnode;
	}

	private void print(ASTNode node) {
		List properties = node.structuralPropertiesForType();
		for (Iterator iterator = properties.iterator(); iterator.hasNext();) {
			Object descriptor = iterator.next();
			if (descriptor instanceof SimplePropertyDescriptor) {
				SimplePropertyDescriptor simple = (SimplePropertyDescriptor) descriptor;
				Object value = node.getStructuralProperty(simple);
				System.out.println(simple.getId() + " (" + value.toString() + ")");
			} else if (descriptor instanceof ChildPropertyDescriptor) {
				ChildPropertyDescriptor child = (ChildPropertyDescriptor) descriptor;
				ASTNode childNode = (ASTNode) node.getStructuralProperty(child);
				if (childNode != null) {
					System.out.println("Child (" + child.getId() + " " + childNode.getNodeType() + ") {");
					print(childNode);
					System.out.println("}");
				}
			} else {
				ChildListPropertyDescriptor list = (ChildListPropertyDescriptor) descriptor;
				System.out.println("List (" + list.getId() + "){");
				print((List) node.getStructuralProperty(list));
				System.out.println("}");
			}
		}
	}

	private void print(List nodes) {
		for (Iterator iterator = nodes.iterator(); iterator.hasNext();) {
			print((ASTNode) iterator.next());
		}
	}
}
